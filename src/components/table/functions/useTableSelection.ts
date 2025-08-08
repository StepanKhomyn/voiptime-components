// useTableSelection.ts
import { computed, ComputedRef, ref, watch } from 'vue';
import type { SelectionChangeEventData, VTableProps } from '../types';

export function useTableSelection(
  props: VTableProps,
  sortedData: ComputedRef<Record<string, any>[]>,
  emit: (event: string, payload: any) => void,
  allData?: ComputedRef<Record<string, any>[]> // всі дані для повного виділення
) {
  const selectionKey = props.selectionKey || 'id';
  const selectedRows = ref<Record<string, any>[]>([]);
  const currentRow = ref<Record<string, any> | null>(null);
  const isFullSelection = ref<boolean>(false); // флаг повного виділення

  // Ініціалізація виділення за замовчуванням
  if (props.defaultSelection?.length) {
    selectedRows.value = [...props.defaultSelection];
  }

  // Допоміжні функції
  const getRowKey = (row: Record<string, any>) => row[selectionKey];

  const isRowSelected = (row: Record<string, any>) => {
    // Якщо увімкнене повне виділення, всі рядки вважаються виділеними
    if (isFullSelection.value) return true;

    return selectedRows.value.some(selectedRow => getRowKey(selectedRow) === getRowKey(row));
  };

  // Computed властивості
  const visibleSelectedCount = computed(() => {
    return sortedData.value.filter(row => isRowSelected(row)).length;
  });

  const isAllVisibleSelected = computed(() => {
    return sortedData.value.length > 0 && visibleSelectedCount.value === sortedData.value.length;
  });

  const isIndeterminate = computed(() => {
    // Якщо повне виділення активне, не показуємо indeterminate
    if (isFullSelection.value) return false;

    const count = visibleSelectedCount.value;
    return count > 0 && count < sortedData.value.length;
  });

  // Головна логіка визначення стану чекбоксу
  const isAllSelected = computed(() => {
    // Якщо повне виділення активне, то завжди показуємо як виділені
    if (isFullSelection.value) return true;
    return isAllVisibleSelected.value && !isIndeterminate.value;
  });

  const isDoubleCheck = computed(() => {
    return isFullSelection.value;
  });

  // Методи
  const toggleRowSelection = (row: Record<string, any>, selected?: boolean) => {
    const rowKey = getRowKey(row);
    const isCurrentlySelected = selectedRows.value.some(selectedRow => getRowKey(selectedRow) === getRowKey(row));
    const shouldSelect = selected !== undefined ? selected : !isCurrentlySelected;

    // Якщо повне виділення активне і намагаємося зняти виділення з рядка
    if (isFullSelection.value && !shouldSelect) {
      // Скидаємо повне виділення і залишаємо тільки інші рядки
      isFullSelection.value = false;

      // Створюємо список виділених без поточного рядка
      if (allData?.value) {
        selectedRows.value = allData.value.filter(item => getRowKey(item) !== rowKey);
      }

      emitSelectionChange(row, false);
      return;
    }

    // Якщо повне виділення активне і намагаємося виділити рядок - нічого не робимо
    if (isFullSelection.value && shouldSelect) {
      return;
    }

    // Звичайна логіка виділення/зняття виділення
    if (shouldSelect && !isCurrentlySelected) {
      selectedRows.value.push(row);
    } else if (!shouldSelect && isCurrentlySelected) {
      selectedRows.value = selectedRows.value.filter(selectedRow => getRowKey(selectedRow) !== rowKey);
    }

    // Якщо select-on-click-row увімкнено і не було явно вказано selected
    if (props.selectOnClickRow && selected === undefined) {
      setCurrentRow(shouldSelect ? row : null);
    }

    emitSelectionChange(row, shouldSelect);
  };

  const toggleAllSelection = () => {
    const currentState = getCurrentSelectionState();

    switch (currentState) {
      case 'none':
      case 'partial':
        // Виділити всі на поточній сторінці
        selectAllVisible();
        break;
      case 'allVisible':
        // Виділити абсолютно всі
        selectAbsolutelyAll();
        break;
      case 'absoluteAll':
        // Скинути виділення
        clearSelection();
        break;
    }
  };

  const getCurrentSelectionState = (): 'none' | 'partial' | 'allVisible' | 'absoluteAll' => {
    if (isFullSelection.value) return 'absoluteAll';
    if (isAllVisibleSelected.value) return 'allVisible';
    if (visibleSelectedCount.value > 0) return 'partial';
    return 'none';
  };

  const selectAllVisible = () => {
    const newSelection: Record<string, any>[] = [];
    const existingKeys = new Set(selectedRows.value.map(row => getRowKey(row)));

    // Додаємо існуючі виділені рядки
    selectedRows.value.forEach(row => {
      newSelection.push(row);
    });

    // Додаємо всі видимі рядки які ще не виділені
    sortedData.value.forEach(row => {
      if (!existingKeys.has(getRowKey(row))) {
        newSelection.push(row);
      }
    });

    selectedRows.value = newSelection;
    isFullSelection.value = false;
    emitSelectionChange();
  };

  const selectAbsolutelyAll = () => {
    // Встановлюємо флаг повного виділення без завантаження всіх даних
    isFullSelection.value = true;

    // Якщо є allData, зберігаємо їх у selectedRows для сумісності
    if (allData?.value) {
      selectedRows.value = [...allData.value];
    } else {
      // Якщо немає allData, зберігаємо тільки поточні відомі дані
      selectedRows.value = [...sortedData.value];
    }

    emitSelectionChange(undefined, undefined, true);
  };

  const clearSelection = () => {
    selectedRows.value = [];
    isFullSelection.value = false;
    currentRow.value = null;
    emitSelectionChange();
  };

  const setCurrentRow = (row: Record<string, any> | null) => {
    const oldCurrentRow = currentRow.value;
    currentRow.value = row;

    emit('current-change', {
      currentRow: currentRow.value,
      oldCurrentRow,
    });
  };

  const getSelectionRows = () => {
    return [...selectedRows.value];
  };

  const setSelectionRows = (rows: Record<string, any>[]) => {
    selectedRows.value = [...rows];
    isFullSelection.value = false;
    emitSelectionChange();
  };

  const emitSelectionChange = (row?: Record<string, any>, selected?: boolean, isAllSelectedFlag: boolean = false) => {
    const eventData: SelectionChangeEventData = {
      selection: [...selectedRows.value],
      row,
      selected,
      isAllSelected: isAllSelectedFlag || isFullSelection.value,
    };

    emit('selection-change', eventData);
  };

  // Вотчери
  watch(
    () => props.defaultSelection,
    newDefaultSelection => {
      if (newDefaultSelection?.length) {
        selectedRows.value = [...newDefaultSelection];
      }
    }
  );

  return {
    selectedRows,
    currentRow,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    isDoubleCheck,
    isFullSelection,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    setCurrentRow,
    getSelectionRows,
    setSelectionRows,
    selectAbsolutelyAll,
  };
}
