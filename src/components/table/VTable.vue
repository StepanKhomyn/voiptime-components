<script setup lang="ts">
  import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue';
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

  // ПРОСТІШЕ РІШЕННЯ: Використовуємо звичайний computed, але з правильною оптимізацією v-memo
  const sortedData = computed(() => {
    return sortTableData(props.data || [], sortState.value, internalColumns);
  });

  // Computed для перевірки наявності defineModel
  const hasColumnsModel = computed(() => modelColumns.value !== undefined);

  // Computed для перевірки чи є дані
  const hasData = computed(() => {
    return props.data && props.data.length > 0;
  });

  // Для затримки при інфініті scroll
  const infinityScrollTriggered = ref(false);
  const lastScrollTop = ref(0);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  // ОПТИМІЗАЦІЯ: Створюємо стабільні ключі для рядків
  const createRowKey = (row: any, index: number): string => {
    if (props.rowKey && row[props.rowKey] != null) {
      return String(row[props.rowKey]);
    }
    return String(index);
  };

  const getRowKey = (row: any, index: number): string => {
    if (props.rowKey && row[props.rowKey] != null) {
      return `row_${row[props.rowKey]}`;
    }
    return `row_${index}`;
  };

  // Ініціалізація internal колонок з пропсів
  const initializeInternalColumns = () => {
    if (hasColumnsModel.value && modelColumns.value) {
      internalColumns.splice(0, internalColumns.length, ...modelColumns.value);
    } else if (props.columns && props.columns.length > 0) {
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
  provide('vt-table-columns', internalColumns);

  // Композабли
  const { sortedColumns, getDefaultColumnWidth, getStickyOffset } = useTableColumns(internalColumns);
  const { getTableWrapperStyle, getColumnStyle, getHeaderStyle, getFooterStyle } = useTableStyles(props);
  const { onMouseDown } = useColumnResize();

  // Computed - всі дані для повного виділення
  const allDataComputed = computed(() => {
    return props.allData || props.data;
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
        zIndex: 11,
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
        zIndex: 11,
      };
    }
    return baseStyle;
  };

  // Infinity Scroll логіка
  const handleScroll = () => {
    if (!tableWrapperRef.value || infinityScrollTriggered.value) return;

    const wrapper = tableWrapperRef.value;
    const scrollTop = wrapper.scrollTop;
    const scrollHeight = wrapper.scrollHeight;
    const clientHeight = wrapper.clientHeight;
    const threshold = 30;

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      const scrollDiff = scrollTop - lastScrollTop.value;
      const isScrollingDown = scrollDiff > 1;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold;
      const isAtBottom = scrollHeight - scrollTop - clientHeight <= 5;

      lastScrollTop.value = scrollTop;

      if (isScrollingDown && (isNearBottom || isAtBottom)) {
        infinityScrollTriggered.value = true;
        emit('infinity-scroll');

        setTimeout(() => {
          infinityScrollTriggered.value = false;
        }, 1000);
      }
    }, 50);
  };

  const resetInfinityScroll = () => {
    infinityScrollTriggered.value = false;
  };

  onMounted(() => {
    if (tableWrapperRef.value) {
      tableWrapperRef.value.addEventListener('scroll', handleScroll);
    }
  });

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
    emit('column-pin', { column: { ...column, ...updates }, position });
  };

  const handleColumnsUpdate = (updatedColumns: VTableColumnProps[]) => {
    internalColumns.splice(0, internalColumns.length, ...updatedColumns);

    if (hasColumnsModel.value) {
      modelColumns.value = [...updatedColumns];
    }

    emit('columns-change', [...updatedColumns]);
  };

  const updateColumn = (prop: string, updates: Partial<VTableColumnProps>) => {
    const columnIndex = internalColumns.findIndex(col => col.prop === prop);

    if (columnIndex !== -1) {
      Object.assign(internalColumns[columnIndex], updates);

      if (hasColumnsModel.value && modelColumns.value) {
        const modelColumnIndex = modelColumns.value.findIndex(col => col.prop === prop);
        if (modelColumnIndex !== -1) {
          const newColumns = [...modelColumns.value];
          newColumns[modelColumnIndex] = { ...newColumns[modelColumnIndex], ...updates };
          modelColumns.value = newColumns;
        }
      }

      emit('columns-change', [...internalColumns]);
    }
  };

  // Обробники кліків
  const handleRowClick = (row: Record<string, any>, column: VTableColumnProps, event: Event): void => {
    emit('row-click', { row, column, event });

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
  };

  // Інші методи
  const setColumnRef = (el: HTMLElement | null, prop: string): void => {
    if (el) {
      columnRefs.value[prop] = el;
    }
  };

  const handleMouseDown = (e: MouseEvent, col: VTableColumnProps): void => {
    const initialWidth = col.width || getDefaultColumnWidth();

    onMouseDown(e, col, getDefaultColumnWidth, (newWidth: number) => {
      updateColumn(col.prop, { width: newWidth });

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

  // ОПТИМІЗАЦІЯ: Створюємо мемо-ключ для кожної комірки
  const getCellMemoKey = (row: any, col: VTableColumnProps, rowIndex: number) => {
    // Включаємо тільки значення колонки і стан виділення (якщо потрібно)
    const cellValue = row[col.prop];
    const isSelected = selectionComposable?.isRowSelected(row) || false;
    return [cellValue, isSelected];
  };

  //метод для сумарного рядку
  const summaryData = computed<Record<string, any>>(() => {
    if (!props.showSummary || !hasData.value) return {};

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

    return columnsToUse.reduce(
      (acc, col) => {
        const values = sortedData.value.map(row => row[col.prop]);
        acc[col.prop] = values.every(val => typeof val === 'number') ? values.reduce((sum, val) => sum + val, 0) : '';
        return acc;
      },
      {} as Record<string, any>
    );
  });

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

  onMounted(() => {
    initializeInternalColumns();
  });

  defineExpose({
    toggleRowSelection,
    toggleAllSelection,
    selectAbsolutelyAll,
    clearSelection,
    getSelectionRows,
    setSelectionRows,
    resetInfinityScroll,
  });
</script>

<template>
  <div ref="tableWrapperRef" class="vt-table-wrapper" :style="getTableWrapperStyle()" @scroll="handleScroll">
    <slot />
    <table class="vt-table">
      <thead>
        <tr>
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
        <tr v-if="!hasData" class="vt-table__empty-row">
          <td :colspan="sortedColumns.length + (props.selectable ? 1 : 0)" class="vt-table__empty-cell">
            <div class="vt-table__empty-content">
              <VIcon name="empty" class="vt-table__empty-icon" />
              <span class="vt-table__empty-text">Немає даних!</span>
            </div>
          </td>
        </tr>

        <!-- МАКСИМАЛЬНА ОПТИМІЗАЦІЯ: Рядки з точною мемоізацією -->
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

          <!-- КРИТИЧНА ОПТИМІЗАЦІЯ: v-memo з точними залежностями -->
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
            v-memo="getCellMemoKey(row, col, rowIndex)"
          >
            <div
              class="vt-table__cell-content vt-table__cell-content--ellipsis"
              v-tooltip="col.showOverflowTooltip ? getTooltipText(row, col) : null"
            >
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
