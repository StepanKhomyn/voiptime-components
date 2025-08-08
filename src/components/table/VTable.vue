<script setup lang="ts">
  import { computed, onMounted, provide, reactive, ref, watch } from 'vue';
  import { type SortDirection, SortState, VTableColumn, VTableEmits, VTableProps } from './types';
  import { useColumnResize, useTableColumns, useTableStyles } from './functions/composables';
  import { useTableSelection } from './functions/useTableSelection';
  import { getSortIconClasses, handleSortDirect, sortTableData } from './functions/sorting';
  import ColumnActions from '@/components/table/ColumnActions.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';

  // Props
  const props = defineProps<
    VTableProps & {
      // Додаткові пропси для повного вибору
      allData?: Record<string, any>[]; // всі дані для повного виділення
    }
  >();

  // defineModel для колонок (опціонально) - тепер не обов'язково
  const modelColumns = defineModel<VTableColumn[]>('columns', { required: false });

  const tableEmit = defineEmits<VTableEmits>();

  // Refs
  const columnRefs = ref<Record<string, HTMLElement>>({});
  const tableWrapperRef = ref<HTMLElement>();

  // Reactive state
  const internalColumns = reactive<VTableColumn[]>([]);
  const sortState = ref<SortState | null>(props.defaultSort || null);

  // Computed для перевірки наявності defineModel
  const hasColumnsModel = computed(() => modelColumns.value !== undefined);

  // Computed - автоматично вибирає джерело колонок
  const currentColumns = computed(() => {
    if (hasColumnsModel.value) {
      return modelColumns.value || [];
    }
    return internalColumns;
  });

  // Ініціалізація internal колонок з пропсів
  const initializeInternalColumns = () => {
    if (hasColumnsModel.value && modelColumns.value) {
      // Якщо є defineModel - використовуємо його
      internalColumns.splice(0, internalColumns.length, ...modelColumns.value);
    } else if (props.columns) {
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
  // Завжди передаємо internal колонки для VTableColumn компонентів
  provide('vt-table-columns', internalColumns);

  // Композабли
  const { sortedColumns, getDefaultColumnWidth, getStickyOffset } = useTableColumns(internalColumns);
  const { getTableWrapperStyle, getColumnStyle, getHeaderStyle, getFooterStyle } = useTableStyles(props);
  const { onMouseDown } = useColumnResize();

  // Computed - відсортовані дані
  const sortedData = computed(() => {
    // Використовуємо internal колонки для сортування
    return sortTableData(props.data, sortState.value, internalColumns);
  });

  // Computed - всі дані для повного виділення
  const allDataComputed = computed(() => {
    return props.allData || props.data;
  });

  // Композабл для виділення (тільки якщо selectable=true)
  const selectionComposable = props.selectable
    ? useTableSelection(props, sortedData, tableEmit, allDataComputed)
    : null;

  // Константа для ширини колонки з чекбоксами
  const SELECTION_COLUMN_WIDTH = 50;

  // Стилі для колонки з чекбоксами
  const getSelectionColumnStyle = () => {
    return {
      width: `${SELECTION_COLUMN_WIDTH}px`,
      minWidth: `${SELECTION_COLUMN_WIDTH}px`,
      maxWidth: `${SELECTION_COLUMN_WIDTH}px`,
      left: '0px',
      position: 'sticky',
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

  // Обробник сортування
  const handleSort = (column: VTableColumn, direction: SortDirection): void => {
    handleSortDirect(column, direction, newSortState => {
      // Якщо вже сортується по цьому напрямку — скинути
      if (sortState.value?.prop === column.prop && sortState.value.direction === direction) {
        sortState.value = null;
      } else {
        sortState.value = newSortState;
      }

      tableEmit('sort-change', {
        column,
        direction: sortState.value?.direction || null,
        prop: column.prop,
        sortedData: sortedData.value,
      });
    });
  };

  const handleColumnPin = (column: VTableColumn, position: 'left' | 'right' | 'none') => {
    console.log(`Колонка "${column.label}" закріплення: ${position}`);

    const updates: Partial<VTableColumn> = {
      pinnedLeft: position === 'left',
      pinnedRight: position === 'right',
    };

    updateColumn(column.prop, updates);

    // Емітуємо подію для батьківського компонента
    tableEmit('column-pin', { column: { ...column, ...updates }, position });
  };

  const handleColumnsUpdate = (updatedColumns: VTableColumn[]) => {
    console.log('handleColumnsUpdate викликано з колонками:', updatedColumns);

    // Очищаємо і оновлюємо internal колонки
    internalColumns.splice(0, internalColumns.length, ...updatedColumns);

    // Якщо використовуєте defineModel - також оновіть його
    if (hasColumnsModel.value) {
      modelColumns.value = [...updatedColumns];
    }

    // Емітуємо подію для батьківського компонента
    tableEmit('columns-change', [...updatedColumns]);
  };

  // Оновлена функція updateColumn
  const updateColumn = (prop: string, updates: Partial<VTableColumn>) => {
    console.log('updateColumn викликано:', { prop, updates, hasColumnsModel: hasColumnsModel.value });

    // Завжди оновлюємо internal колонки (так як VTableColumn компоненти реєструються там)
    const columnIndex = internalColumns.findIndex(col => col.prop === prop);

    if (columnIndex !== -1) {
      // Оновлюємо internal колонку
      console.log('Оновлюємо internalColumns:', columnIndex, updates);
      Object.assign(internalColumns[columnIndex], updates);

      // Якщо є defineModel - також оновлюємо його
      if (hasColumnsModel.value && modelColumns.value) {
        const modelColumnIndex = modelColumns.value.findIndex(col => col.prop === prop);
        if (modelColumnIndex !== -1) {
          const newColumns = [...modelColumns.value];
          newColumns[modelColumnIndex] = { ...newColumns[modelColumnIndex], ...updates };
          console.log('Оновлюємо через defineModel:', newColumns);
          modelColumns.value = newColumns;
        }
      }

      // В будь-якому випадку емітуємо подію про зміну колонок
      // Використовуємо internal колонки як джерело істини
      tableEmit('columns-change', [...internalColumns]);
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
  const handleRowClick = (row: Record<string, any>, column: VTableColumn, event: Event): void => {
    tableEmit('row-click', { row, column, event });

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

  const handleSelectAllChange = (isChecked: boolean, event: Event): void => {
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

  const handleMouseDown = (e: MouseEvent, col: VTableColumn): void => {
    // Зберігаємо початкову ширину
    const initialWidth = col.width || getDefaultColumnWidth(col.prop);
    console.log(initialWidth);

    onMouseDown(e, col, getDefaultColumnWidth, (newWidth: number) => {
      // Оновлюємо ширину колонки
      console.log(newWidth);
      updateColumn(col.prop, { width: newWidth });

      // Емітуємо подію про зміну розміру
      tableEmit('column-resize', {
        column: { ...col, width: newWidth },
        width: newWidth,
        oldWidth: initialWidth,
      });
    });
  };

  const getColumnStyleWithContext = (col: VTableColumn, index: number) => {
    return getColumnStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getHeaderStyleWithContext = (col: VTableColumn, index: number) => {
    return getHeaderStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getFooterStyleWithContext = (col: VTableColumn, index: number) => {
    return getFooterStyle(col, index, getStickyOffset, getDefaultColumnWidth);
  };

  const getTooltipText = (row: any, col: VTableColumn): string => {
    if (!col || !col.prop) return '';
    const value = row[col.prop];
    return value == null ? '' : String(value);
  };

  //метод для сумарного рядку
  const summaryData = computed<Record<string, any>>(() => {
    if (!props.showSummary) return {};

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

    // Дефолтна реалізація — сума числових
    return columnsToUse.reduce(
      (acc, col) => {
        const values = sortedData.value.map(row => row[col.prop]);
        acc[col.prop] = values.every(val => typeof val === 'number') ? values.reduce((sum, val) => sum + val, 0) : '';
        return acc;
      },
      {} as Record<string, any>
    );
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
  });
</script>

<template>
  <div ref="tableWrapperRef" class="vt-table-wrapper" :style="getTableWrapperStyle()">
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
        <tr
          v-for="row in sortedData"
          :key="row.id"
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

          <td
            v-for="(col, colIndex) in sortedColumns"
            :key="col.prop"
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
              <component v-if="col.renderSlot" :is="col.renderSlot" :row="row" :column="col" :value="row[col.prop]" />
              <!-- Fallback контент якщо слот не передано -->
              <span v-else>{{ row[col.prop] }}</span>
            </div>
            <div class="vt-table__resizer" :data-resizer="col.prop" @mousedown="e => handleMouseDown(e, col)" />
          </td>
        </tr>
      </tbody>

      <tfoot v-if="props.showSummary" class="vt-table__summary">
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
