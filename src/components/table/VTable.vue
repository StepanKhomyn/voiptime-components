<script setup lang="ts">
  import { computed, markRaw, onMounted, onUnmounted, provide, reactive, ref, shallowRef, watch } from 'vue';
  import type { SortDirection, SortState, VTableColumnProps, VTableEmits, VTableProps } from './types';
  import { useColumnResize, useTableColumns, useTableStyles } from './functions/composables';
  import { useTableSelection } from './functions/useTableSelection';
  import { renderTableSlot } from './functions/useTableSlots';
  import { getSortIconClasses, handleSortDirect, sortTableData } from './functions/sorting';
  import ColumnActions from '@/components/table/ColumnActions.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';

  // Явно типізуємо props з withDefaults
  const props = withDefaults(defineProps<VTableProps>(), {
    selectable: false,
    selectOnClickRow: false,
    highlightCurrentRow: false,
    showSummary: false,
    maxHeight: undefined,
    selectionKey: 'id',
    rowKey: 'id',
    defaultSelection: () => [],
    allData: undefined,
    columnsSelector: () => [],
    columns: () => [],
  });

  // Явно типізуємо emits
  const emit = defineEmits<VTableEmits>();

  // defineModel для колонок (опціонально) - з явною типізацією
  const modelColumns = defineModel<VTableColumnProps[] | undefined>('columns', {
    required: false,
    default: undefined,
  });

  // Refs
  const columnRefs = ref<Record<string, HTMLElement>>({});
  const tableWrapperRef = ref<HTMLElement>();

  // Reactive state
  const internalColumns = reactive<VTableColumnProps[]>([]);
  const sortState = ref<SortState | null>(props.defaultSort || null);

  // ОПТИМІЗАЦІЯ: Використовуємо shallowRef для даних, щоб уникнути глибокої реактивності
  const internalData = shallowRef<any[]>([]);

  // ОПТИМІЗАЦІЯ: Кешуємо хеші рядків для відстеження змін
  const rowHashes = ref<Map<string, string>>(new Map());

  // ОПТИМІЗАЦІЯ: Створюємо стабільні ключі для рядків
  const createRowKey = (row: any, index: number): string => {
    if (props.rowKey && row[props.rowKey] != null) {
      return String(row[props.rowKey]);
    }
    return String(index);
  };

  // ОПТИМІЗАЦІЯ: Функція для створення хешу рядка
  const createRowHash = (row: any): string => {
    return JSON.stringify(row);
  };

  // ОПТИМІЗАЦІЯ: Оновлюємо внутрішні дані з відстеженням змін
  const updateInternalData = (newData: any[]) => {
    const newHashes = new Map<string, string>();

    newData.forEach((row, index) => {
      const key = createRowKey(row, index);
      const hash = createRowHash(row);
      newHashes.set(key, hash);
    });

    rowHashes.value = newHashes;
    internalData.value = markRaw([...newData]); // markRaw для уникнення глибокої реактивності
  };

  // Слідкуємо за змінами в props.data
  watch(
    () => props.data,
    newData => {
      if (newData) {
        updateInternalData(newData);
      }
    },
    { immediate: true }
  );

  // Computed для перевірки наявності defineModel
  const hasColumnsModel = computed(() => modelColumns.value !== undefined);

  // Computed для перевірки чи є дані
  const hasData = computed(() => {
    return internalData.value && internalData.value.length > 0;
  });

  // Для затримки при інфініті scroll
  const infinityScrollTriggered = ref(false);
  // Для відстеження попередньої позиції скролу
  const lastScrollTop = ref(0);
  // Для debounce
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const getRowKey = (row: any, index: number): string => {
    if (props.rowKey && row[props.rowKey] != null) {
      return `row_${row[props.rowKey]}`;
    }
    return `row_${index}`;
  };

  // Ініціалізація internal колонок з пропсів
  const initializeInternalColumns = () => {
    if (hasColumnsModel.value && modelColumns.value) {
      // Якщо є defineModel - використовуємо його
      internalColumns.splice(0, internalColumns.length, ...modelColumns.value);
    } else if (props.columns && props.columns.length > 0) {
      // Якщо немає defineModel, але є пропс columns
      internalColumns.splice(0, internalColumns.length, ...props.columns);
    }
  };

  // Слідкуємо за змінами в modelColumns
  watch(
    () => modelColumns.value,
    newColumns => {
      if (newColumns && hasColumnsModel.value) {
        internalColumns.splice(0, internalColumns.length, ...newColumns);
      }
    },
    { deep: true }
  );

  // Слідкуємо за змінами в props.columns
  watch(
    () => props.columns,
    newColumns => {
      if (newColumns && !hasColumnsModel.value) {
        internalColumns.splice(0, internalColumns.length, ...newColumns);
      }
    },
    { deep: true }
  );

  // Provide columns для child компонентів
  // Завжди передаємо internal колонки для VTableColumnProps компонентів
  provide('vt-table-columns', internalColumns);

  // Композабли
  const { sortedColumns, getDefaultColumnWidth, getStickyOffset } = useTableColumns(internalColumns);
  const { getTableWrapperStyle, getColumnStyle, getHeaderStyle, getFooterStyle } = useTableStyles(props);
  const { onMouseDown } = useColumnResize();

  // Computed - відсортовані дані
  const sortedData = computed(() => {
    // Використовуємо internal дані замість props.data
    return sortTableData(internalData.value, sortState.value, internalColumns);
  });

  // Computed - всі дані для повного виділення
  const allDataComputed = computed(() => {
    return props.allData || internalData.value;
  });

  // Композабл для виділення (тільки якщо selectable=true)
  const selectionComposable = props.selectable ? useTableSelection(props, sortedData, emit, allDataComputed) : null;

  // Константа для ширини колонки з чекбоксами
  const SELECTION_COLUMN_WIDTH = 50;

  // Стилі для колонки з чекбоксами
  const getSelectionColumnStyle = () => {
    return {
      width: `${SELECTION_COLUMN_WIDTH}px`,
      minWidth: `${SELECTION_COLUMN_WIDTH}px`,
      maxWidth: `${SELECTION_COLUMN_WIDTH}px`,
      left: '0px',
      position: 'sticky' as const,
      zIndex: 10,
    };
  };

  const getSelectionColumnHeaderStyle = () => {
    const baseStyle = getSelectionColumnStyle();
    if (props.maxHeight) {
      return {
        ...baseStyle,
        top: '0px',
        zIndex: 11, // Вищий z-index для header
      };
    }
    return baseStyle;
  };

  const getSelectionColumnFooterStyle = () => {
    const baseStyle = getSelectionColumnStyle();
    if (props.maxHeight) {
      return {
        ...baseStyle,
        bottom: '0px',
        zIndex: 11, // Вищий z-index для footer
      };
    }
    return baseStyle;
  };

  // Infinity Scroll логіка з покращеною перевіркою напрямку
  const handleScroll = () => {
    if (!tableWrapperRef.value || infinityScrollTriggered.value) return;

    const wrapper = tableWrapperRef.value;
    const scrollTop = wrapper.scrollTop;
    const scrollHeight = wrapper.scrollHeight;
    const clientHeight = wrapper.clientHeight;
    const threshold = 30;

    // Очищаємо попередній таймер
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Використовуємо debounce для стабілізації
    scrollTimeout = setTimeout(() => {
      // Перевіряємо напрямок скролу з мінімальною різницею
      const scrollDiff = scrollTop - lastScrollTop.value;
      const isScrollingDown = scrollDiff > 1; // мінімум 1px вниз

      // Перевіряємо чи ми близько до низу
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold;

      // Перевіряємо чи ми дійсно в самому низу (допуск ±5px)
      const isAtBottom = scrollHeight - scrollTop - clientHeight <= 5;

      // Оновлюємо попередню позицію ПІСЛЯ перевірки
      lastScrollTop.value = scrollTop;

      // Спрацьовує тільки якщо:
      // 1. Скролимо вниз (мінімум 1px)
      // 2. Близько до низу або в самому низу
      // 3. Увімкнено infinity scroll
      if (isScrollingDown && (isNearBottom || isAtBottom)) {
        infinityScrollTriggered.value = true;
        emit('infinity-scroll');

        // Скидаємо флаг через деякий час
        setTimeout(() => {
          infinityScrollTriggered.value = false;
        }, 1000);
      }
    }, 50); // debounce 50ms
  };

  // Метод для ручного скидання флагу infinity scroll
  const resetInfinityScroll = () => {
    infinityScrollTriggered.value = false;
  };

  // Додаємо обробник скролу при монтуванні
  onMounted(() => {
    if (tableWrapperRef.value) {
      tableWrapperRef.value.addEventListener('scroll', handleScroll);
    }
  });

  // Видаляємо обробник при демонтуванні
  onUnmounted(() => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    if (tableWrapperRef.value) {
      tableWrapperRef.value.removeEventListener('scroll', handleScroll);
    }
  });

  // Обробник сортування
  const handleSort = (column: VTableColumnProps, direction: SortDirection): void => {
    handleSortDirect(column, direction, newSortState => {
      // Якщо вже сортується по цьому напрямку — скинути
      if (sortState.value?.prop === column.prop && sortState.value.direction === direction) {
        sortState.value = null;
      } else {
        sortState.value = newSortState;
      }

      emit('sort-change', {
        column,
        direction: sortState.value?.direction || null,
        prop: column.prop,
        sortedData: sortedData.value,
      });
    });
  };

  const handleColumnPin = (column: VTableColumnProps, position: 'left' | 'right' | 'none') => {
    const updates: Partial<VTableColumnProps> = {
      pinnedLeft: position === 'left',
      pinnedRight: position === 'right',
    };

    updateColumn(column.prop, updates);

    // Емітуємо подію для батьківського компонента
    emit('column-pin', { column: { ...column, ...updates }, position });
  };

  const handleColumnsUpdate = (updatedColumns: VTableColumnProps[]) => {
    // Очищаємо і оновлюємо internal колонки
    internalColumns.splice(0, internalColumns.length, ...updatedColumns);

    // Якщо використовуєте defineModel - також оновіть його
    if (hasColumnsModel.value) {
      modelColumns.value = [...updatedColumns];
    }

    // Емітуємо подію для батьківського компонента
    emit('columns-change', [...updatedColumns]);
  };

  // Оновлена функція updateColumn
  const updateColumn = (prop: string, updates: Partial<VTableColumnProps>) => {
    // Завжди оновлюємо internal колонки (так як VTableColumnProps компоненти реєструються там)
    const columnIndex = internalColumns.findIndex(col => col.prop === prop);

    if (columnIndex !== -1) {
      // Оновлюємо internal колонку
      Object.assign(internalColumns[columnIndex], updates);

      // Якщо є defineModel - також оновлюємо його
      if (hasColumnsModel.value && modelColumns.value) {
        const modelColumnIndex = modelColumns.value.findIndex(col => col.prop === prop);
        if (modelColumnIndex !== -1) {
          const newColumns = [...modelColumns.value];
          newColumns[modelColumnIndex] = { ...newColumns[modelColumnIndex], ...updates };
          modelColumns.value = newColumns;
        }
      }

      // В будь-якому випадку емітуємо подію про зміну колонок
      // Використовуємо internal колонки як джерело істини
      emit('columns-change', [...internalColumns]);
    } else {
      console.error(
        'Колонку не знайдено:',
        prop,
        'Доступні колонки:',
        internalColumns.map(c => c.prop)
      );
    }
  };

  // Обробники кліків
  const handleRowClick = (row: Record<string, any>, column: VTableColumnProps, event: Event): void => {
    emit('row-click', { row, column, event });

    // НЕ викликаємо toggleRowSelection тут, оскільки це вже робиться автоматично через select-on-click-row
    // Тільки встановлюємо поточний рядок якщо потрібно
    if (props.highlightCurrentRow && selectionComposable) {
      selectionComposable.setCurrentRow(row);
    }
  };

  const handleCheckboxChange = (isChecked: boolean, row: Record<string, any>, event: Event): void => {
    event.stopPropagation();
    if (selectionComposable) {
      selectionComposable.toggleRowSelection(row, isChecked);
    }
  };

  const handleSelectAllChange = (value: boolean, event: Event): void => {
    event.stopPropagation();
    if (selectionComposable) {
      selectionComposable.toggleAllSelection();
    }
    if (value === undefined) {
    }
  };

  // Інші методи
  const setColumnRef = (el: HTMLElement | null, prop: string): void => {
    if (el) {
      columnRefs.value[prop] = el;
    }
  };

  const handleMouseDown = (e: MouseEvent, col: VTableColumnProps): void => {
    // Зберігаємо початкову ширину
    const initialWidth = col.width || getDefaultColumnWidth();

    onMouseDown(e, col, getDefaultColumnWidth, (newWidth: number) => {
      // Оновлюємо ширину колонки
      updateColumn(col.prop, { width: newWidth });

      // Емітуємо подію про зміну розміру
      emit('column-resize', {
        column: { ...col, width: newWidth },
        width: newWidth,
        oldWidth: initialWidth,
      });
    });
  };

  const getColumnStyleWithContext = (col: VTableColumnProps, index: number) => {
    return getColumnStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getHeaderStyleWithContext = (col: VTableColumnProps, index: number) => {
    return getHeaderStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getFooterStyleWithContext = (col: VTableColumnProps, index: number) => {
    return getFooterStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getTooltipText = (row: any, col: VTableColumnProps): string => {
    if (!col || !col.prop) return '';
    const value = row[col.prop];
    return value == null ? '' : String(value);
  };

  // ОПТИМІЗАЦІЯ: Функція для перевірки, чи змінився рядок
  const hasRowChanged = (row: any, index: number): boolean => {
    const key = createRowKey(row, index);
    const currentHash = createRowHash(row);
    const previousHash = rowHashes.value.get(key);
    return currentHash !== previousHash;
  };

  //метод для сумарного рядку
  const summaryData = computed<Record<string, any>>(() => {
    // Не показувати summary якщо немає даних
    if (!props.showSummary || !hasData.value) return {};

    // Використовуємо internal колонки як джерело істини для відображення
    const columnsToUse = internalColumns;

    if (typeof props.summaryMethod === 'function') {
      const summaryArray = props.summaryMethod({ columns: columnsToUse, data: sortedData.value });
      return columnsToUse.reduce(
        (acc, col, index) => {
          acc[col.prop] = summaryArray[index];
          return acc;
        },
        {} as Record<string, any>
      );
    }

    // Дефолтна реалізація — сума числови
    return columnsToUse.reduce(
      (acc, col) => {
        const values = sortedData.value.map(row => row[col.prop]);
        acc[col.prop] = values.every(val => typeof val === 'number') ? values.reduce((sum, val) => sum + val, 0) : '';
        return acc;
      },
      {} as Record<string, any>
    );
  });

  // Computed для перевірки чи показувати summary
  const shouldShowSummary = computed(() => {
    return props.showSummary && hasData.value;
  });

  // Публічні методи для зовнішнього використання
  const toggleRowSelection = (row: Record<string, any>, selected?: boolean) => {
    if (selectionComposable) {
      selectionComposable.toggleRowSelection(row, selected);
    }
  };

  const toggleAllSelection = () => {
    if (selectionComposable) {
      selectionComposable.toggleAllSelection();
    }
  };

  const selectAbsolutelyAll = () => {
    if (selectionComposable) {
      selectionComposable.selectAbsolutelyAll();
    }
  };

  const clearSelection = () => {
    if (selectionComposable) {
      selectionComposable.clearSelection();
    }
  };

  const getSelectionRows = (): Record<string, any>[] => {
    return selectionComposable ? selectionComposable.getSelectionRows() : [];
  };

  const setSelectionRows = (rows: Record<string, any>[]) => {
    if (selectionComposable) {
      selectionComposable.setSelectionRows(rows);
    }
  };

  // ОПТИМІЗАЦІЯ: Метод для оновлення конкретного рядка
  const updateRow = (rowKey: string, updatedRow: any) => {
    const currentData = [...internalData.value];
    const rowIndex = currentData.findIndex((row, index) => {
      return createRowKey(row, index) === rowKey;
    });

    if (rowIndex !== -1) {
      currentData[rowIndex] = markRaw(updatedRow);
      updateInternalData(currentData);
    }
  };

  // Ініціалізація при монтуванні
  onMounted(() => {
    initializeInternalColumns();
  });

  // Експорт методів для батьківського компонента
  defineExpose({
    toggleRowSelection,
    toggleAllSelection,
    selectAbsolutelyAll,
    clearSelection,
    getSelectionRows,
    setSelectionRows,
    resetInfinityScroll, // Додаємо метод для скидання infinity scroll
    updateRow, // ОПТИМІЗАЦІЯ: Додаємо метод для оновлення конкретного рядка
  });
</script>

<template>
  <div ref="tableWrapperRef" class="vt-table-wrapper" :style="getTableWrapperStyle()" @scroll="handleScroll">
    <!-- Таблиця з даними -->
    <slot />
    <table class="vt-table">
      <thead>
        <tr>
          <!-- Колонка для checkboxes -->
          <th
            v-if="props.selectable"
            class="vt-table__th vt-table__th--selection"
            :style="getSelectionColumnHeaderStyle()"
            :class="{
              'vt-table__th--sticky': props.maxHeight,
              'vt-table__th--pinned-left': true,
            }"
          >
            <div class="vt-th__content">
              <VCheckbox
                :checked="selectionComposable?.isAllSelected.value"
                :indeterminate="selectionComposable?.isIndeterminate.value"
                :is-double="selectionComposable?.isDoubleCheck?.value"
                @change="handleSelectAllChange"
              />
            </div>
          </th>

          <th
            v-for="(col, index) in sortedColumns"
            :key="col.prop"
            :ref="el => setColumnRef(el as HTMLElement, col.prop)"
            :style="getHeaderStyleWithContext(col, index)"
            :class="[
              'vt-table__th',
              {
                'vt-table__th--sticky': props.maxHeight,
                'vt-table__th--pinned-left': col.pinnedLeft,
                'vt-table__th--pinned-right': col.pinnedRight,
                'vt-table__th--sortable': col.sortable,
              },
            ]"
          >
            <div class="vt-th__content">
              <div class="vt-th__label">
                {{ col.label }}
              </div>

              <div v-if="col.sortable" class="vt-th__sortable">
                <VIcon
                  name="arrowTop"
                  :class="getSortIconClasses(col, sortState).asc"
                  @click.stop="handleSort(col, 'asc')"
                />
                <VIcon
                  name="arrowDown"
                  :class="getSortIconClasses(col, sortState).desc"
                  @click.stop="handleSort(col, 'desc')"
                />
              </div>

              <ColumnActions
                v-if="col.actionColumn"
                :column="col"
                :all-columns="sortedColumns"
                :columnsSelector="props.columnsSelector"
                @pin="handleColumnPin"
                @update-columns="handleColumnsUpdate"
              />
            </div>

            <div class="vt-table__resizer" :data-resizer="col.prop" @mousedown="e => handleMouseDown(e, col)" />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Порожній стан в tbody -->
        <tr v-if="!hasData" class="vt-table__empty-row">
          <td :colspan="sortedColumns.length + (props.selectable ? 1 : 0)" class="vt-table__empty-cell">
            <div class="vt-table__empty-content">
              <VIcon name="empty" class="vt-table__empty-icon" />
              <span class="vt-table__empty-text">Немає даних!</span>
            </div>
          </td>
        </tr>

        <!-- ОПТИМІЗАЦІЯ: Рядки з даними з покращеним мемоізуванням -->
        <tr
          v-else
          v-for="(row, rowIndex) in sortedData"
          :key="createRowKey(row, rowIndex)"
          :class="[
            'vt-table__row',
            {
              'vt-table__row--selected': selectionComposable?.isRowSelected(row),
              'vt-table__row--current': selectionComposable?.currentRow.value === row,
              'vt-table__row--clickable': props.selectOnClickRow || props.highlightCurrentRow,
            },
          ]"
          @click="handleRowClick(row, sortedColumns[0], $event)"
        >
          <!-- Колонка для checkbox -->
          <td
            v-if="props.selectable"
            class="vt-table__td vt-table__td--selection"
            :style="getSelectionColumnStyle()"
            :class="{
              'vt-table__td--pinned-left': true,
            }"
          >
            <div class="vt-table__cell-content">
              <VCheckbox
                :checked="selectionComposable?.isRowSelected(row)"
                @change="(isChecked, event) => handleCheckboxChange(isChecked, row, event)"
              />
            </div>
          </td>

          <!-- ОПТИМІЗАЦІЯ: Покращене мемоізування колонок -->
          <td
            v-for="(col, colIndex) in sortedColumns"
            :key="`${createRowKey(row, rowIndex)}-${col.prop}`"
            :ref="el => setColumnRef(el as HTMLElement, col.prop)"
            :style="getColumnStyleWithContext(col, colIndex)"
            :class="[
              'vt-table__td',
              {
                'vt-table__td--pinned-left': col.pinnedLeft,
                'vt-table__td--pinned-right': col.pinnedRight,
              },
            ]"
          >
            <div
              class="vt-table__cell-content vt-table__cell-content--ellipsis"
              v-tooltip="col.showOverflowTooltip ? getTooltipText(row, col) : null"
            >
              <!-- Використовуємо збережений слот з колонки -->
              <component
                v-if="col.renderSlot"
                :is="() => renderTableSlot(col.renderSlot, { row, column: col, value: row[col.prop], index: rowIndex })"
              />
              <span v-else>{{ row[col.prop] }}</span>
            </div>
            <div class="vt-table__resizer" :data-resizer="col.prop" @mousedown="e => handleMouseDown(e, col)" />
          </td>
        </tr>
      </tbody>

      <tfoot v-if="shouldShowSummary" class="vt-table__summary">
        <tr>
          <!-- Колонка для checkbox в summary -->
          <td
            v-if="props.selectable"
            class="vt-table__td"
            :style="getSelectionColumnFooterStyle()"
            :class="{
              'vt-table__td--pinned-left': true,
            }"
          >
            <div class="vt-table__cell-content vt-table__cell-content--summary"></div>
          </td>

          <td
            v-for="(col, colIndex) in sortedColumns"
            :key="col.prop"
            :style="getFooterStyleWithContext(col, colIndex)"
            :class="[
              'vt-table__td',
              {
                'vt-table__td--pinned-left': col.pinnedLeft,
                'vt-table__td--pinned-right': col.pinnedRight,
              },
            ]"
          >
            <div class="vt-table__cell-content vt-table__cell-content--summary">
              {{ summaryData[col.prop] }}
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
