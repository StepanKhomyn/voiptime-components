// useTableSelection.ts
import type { ComputedRef } from 'vue';
import { computed, ref, watch } from 'vue';
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
    const count = visibleSelectedCount.value;
    return count > 0 && count < sortedData.value.length && !isFullSelection.value;
  });

  // Головна логіка визначення стану чекбоксу
  const isAllSelected = computed(() => {
    return isAllVisibleSelected.value && !isIndeterminate.value;
  });

  const isDoubleCheck = computed(() => {
    return isFullSelection.value;
  });

  // Методи
  const toggleRowSelection = (row: Record<string, any>, selected?: boolean) => {
    const rowKey = getRowKey(row);
    const isCurrentlySelected = isRowSelected(row);
    const shouldSelect = selected !== undefined ? selected : !isCurrentlySelected;

    if (shouldSelect && !isCurrentlySelected) {
      selectedRows.value.push(row);
    } else if (!shouldSelect && isCurrentlySelected) {
      selectedRows.value = selectedRows.value.filter(selectedRow => getRowKey(selectedRow) !== rowKey);
      // Якщо видаляємо рядок і було повне виділення - скидаємо повне виділення
      if (isFullSelection.value) {
        isFullSelection.value = false;
      }
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
    if (allData?.value) {
      selectedRows.value = [...allData.value];
      isFullSelection.value = true;
      emitSelectionChange(undefined, undefined, true);
    }
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
