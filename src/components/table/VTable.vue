<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue';
  import type { SortDirection, SortState, VTableColumnProps, VTableEmits, VTableProps } from './types';
  import { useColumnResize, useTableColumns, useTableStyles } from './functions/composables';
  import { useTableSelection } from './functions/useTableSelection';
  import { useRowDrag } from './functions/useRowDrag';
  import { getSortIconClasses, handleSortDirect, sortTableData } from './functions/sorting';
  import ColumnActions from '@/components/table/ColumnActions.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';

  const props = withDefaults(defineProps<VTableProps>(), {
    selectable: false,
    isAllSelect: false,
    selectOnClickRow: false,
    highlightCurrentRow: false,
    showSummary: false,
    maxHeight: undefined,
    selectionKey: 'id',
    rowKey: 'id',
    hideHeader: false,
    defaultSelection: () => [],
    allData: undefined,
    columnsSelector: () => [],
    columns: () => [],
    rowDraggable: false,
    showDragHandle: true,
  });

  const emit = defineEmits<VTableEmits>();

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

  const sortedData = computed(() => {
    return sortTableData(props.data || [], sortState.value, internalColumns);
  });

  const hasColumnsModel = computed(() => modelColumns.value !== undefined);
  const hasData = computed(() => {
    return props.data && props.data.length > 0;
  });

  const infinityScrollTriggered = ref(false);
  const lastScrollTop = ref(0);
  let scrollTimeout: ReturnType<typeof setTimeout>;

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

  watch(
    () => modelColumns.value,
    newColumns => {
      if (newColumns && hasColumnsModel.value) {
        internalColumns.length = 0;
        internalColumns.push(...newColumns);
      }
    },
    { deep: true }
  );

  watch(
    () => props.columns,
    newColumns => {
      if (newColumns && !hasColumnsModel.value) {
        internalColumns.length = 0;
        internalColumns.push(...newColumns);
      }
    },
    { deep: true }
  );

  provide('vt-table-columns', internalColumns);

  const { sortedColumns, getDefaultColumnWidth, getStickyOffset } = useTableColumns(internalColumns);
  const { getTableWrapperStyle, getColumnStyle, getHeaderStyle, getFooterStyle } = useTableStyles(props);
  const { onMouseDown } = useColumnResize();

  const allDataComputed = computed(() => {
    return props.allData || props.data;
  });

  const selectionComposable = props.selectable ? useTableSelection(props, sortedData, emit, allDataComputed) : null;

  // Ініціалізуємо drag & drop composable
  const dragComposable = props.rowDraggable ? useRowDrag(() => sortedData.value, emit) : null;
  const SELECTION_COLUMN_WIDTH = 50;
  const DRAG_HANDLE_WIDTH = 40;

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

  const getDragHandleColumnStyle = () => {
    const leftOffset = props.selectable ? SELECTION_COLUMN_WIDTH : 0;
    return {
      width: `${DRAG_HANDLE_WIDTH}px`,
      minWidth: `${DRAG_HANDLE_WIDTH}px`,
      maxWidth: `${DRAG_HANDLE_WIDTH}px`,
      left: `${leftOffset}px`,
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
        zIndex: 12,
      };
    }
    return baseStyle;
  };

  const getDragHandleHeaderStyle = () => {
    const baseStyle = getDragHandleColumnStyle();
    if (props.maxHeight) {
      return {
        ...baseStyle,
        top: '0px',
        zIndex: 12,
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
        zIndex: 12,
      };
    }
    return baseStyle;
  };

  const getDragHandleFooterStyle = () => {
    const baseStyle = getDragHandleColumnStyle();
    if (props.maxHeight) {
      return {
        ...baseStyle,
        bottom: '0px',
        zIndex: 12,
      };
    }
    return baseStyle;
  };

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
        infinityScrollTriggered.value = false;
      }
    }, 50);
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

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getTooltipText = (row: any, col: VTableColumnProps): string => {
    if (!col?.prop) return '';

    const value = row[col.prop];
    if (value == null) return '';

    if (typeof value === 'string' && value.includes('<')) {
      return stripHtml(value);
    }

    return String(value);
  };

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

  const getRowHighlightClasses = (row: any, rowIndex: number): string[] => {
    if (!props.rowHighlight) return [];

    try {
      const highlightResult = props.rowHighlight(row, rowIndex);
      if (!highlightResult) return [];

      const classes: string[] = [];

      if (highlightResult.type !== 'custom' || !highlightResult.className) {
        classes.push(`vt-table__row--highlight-${highlightResult.type}`);
      }

      if (highlightResult.className) {
        classes.push(highlightResult.className);
      }

      return classes;
    } catch (error) {
      console.warn('Помилка у функції підсвічування рядків:', error);
      return [];
    }
  };

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
  <div ref="tableWrapperRef" :style="getTableWrapperStyle()" class="vt-table-wrapper" @scroll="handleScroll">
    <slot />
    <table class="vt-table">
      <thead v-if="!props.hideHeader">
        <tr>
          <th
            v-if="props.selectable"
            :class="{
              'vt-table__th--sticky': props.maxHeight,
              'vt-table__th--pinned-left': true,
            }"
            :style="getSelectionColumnHeaderStyle()"
            class="vt-table__th vt-table__th--selection"
          >
            <div class="vt-th__content">
              <VCheckbox
                :checked="selectionComposable?.isAllSelected.value"
                :indeterminate="selectionComposable?.isIndeterminate.value"
                :is-double="props.isAllSelect && selectionComposable?.isDoubleCheck?.value"
                @change="handleSelectAllChange"
              />
            </div>
          </th>

          <th
            v-if="props.rowDraggable && props.showDragHandle"
            :class="{
              'vt-table__th--sticky': props.maxHeight,
              'vt-table__th--pinned-left': true,
            }"
            :style="getDragHandleHeaderStyle()"
            class="vt-table__th vt-table__th--drag-handle"
          >
            <div class="vt-th__content"></div>
          </th>

          <th
            v-for="(col, index) in sortedColumns"
            :key="col.prop"
            :ref="el => setColumnRef(el as HTMLElement, col.prop)"
            :class="[
              'vt-table__th',
              {
                'vt-table__th--sticky': props.maxHeight,
                'vt-table__th--pinned-left': col.pinnedLeft,
                'vt-table__th--pinned-right': col.pinnedRight,
                'vt-table__th--sortable': col.sortable,
                'vt-table__th--manage': col.manage,
              },
            ]"
            :style="getHeaderStyleWithContext(col, index)"
          >
            <div class="vt-th__content">
              <div v-tooltip="col.label" class="vt-th__label">
                {{ col.label }}
              </div>

              <div v-if="col.sortable && !col.manage" class="vt-th__sortable">
                <VIcon
                  :class="getSortIconClasses(col, sortState).asc"
                  name="arrowTop"
                  @click.stop="handleSort(col, 'asc')"
                />
                <VIcon
                  :class="getSortIconClasses(col, sortState).desc"
                  name="arrowDown"
                  @click.stop="handleSort(col, 'desc')"
                />
              </div>

              <ColumnActions
                v-if="col.actionColumn && !col.manage"
                :all-columns="sortedColumns"
                :column="col"
                :columnsSelector="props.columnsSelector"
                @pin="handleColumnPin"
                @update-columns="handleColumnsUpdate"
              />
            </div>

            <div
              v-if="!col.manage"
              :data-resizer="col.prop"
              class="vt-table__resizer"
              @mousedown="e => handleMouseDown(e, col)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!hasData" class="vt-table__empty-row">
          <td
            :colspan="
              sortedColumns.length + (props.selectable ? 1 : 0) + (props.rowDraggable && props.showDragHandle ? 1 : 0)
            "
            class="vt-table__empty-cell"
          >
            <div class="vt-table__empty-content">
              <VIcon class="vt-table__empty-icon" name="empty" />
              <span class="vt-table__empty-text">Немає даних!</span>
            </div>
          </td>
        </tr>
        <template v-for="(row, rowIndex) in sortedData" v-else :key="createRowKey(row, rowIndex)">
          <tr
            :class="{
              'vt-table__row--insert-before': dragComposable?.shouldShowInsertLine(rowIndex, 'before'),
            }"
          ></tr>
          <tr
            :class="[
              'vt-table__row',
              {
                'vt-table__row--selected': selectionComposable?.isRowSelected(row),
                'vt-table__row--current': selectionComposable?.currentRow.value === row,
                'vt-table__row--clickable': props.selectOnClickRow || props.highlightCurrentRow,
                'vt-table__row--draggable': props.rowDraggable,
              },
              ...getRowHighlightClasses(row, rowIndex),
            ]"
            :draggable="props.rowDraggable"
            @click="handleRowClick(row, sortedColumns[0], $event)"
            @dragend="dragComposable ? dragComposable.handleDragEnd($event) : null"
            @dragenter="dragComposable ? dragComposable.handleDragEnter($event, rowIndex) : null"
            @dragleave="dragComposable ? dragComposable.handleDragLeave($event) : null"
            @dragover="dragComposable ? dragComposable.handleDragOver($event, rowIndex) : null"
            @dragstart="dragComposable ? dragComposable.handleDragStart($event, row, rowIndex) : null"
            @drop="dragComposable ? dragComposable.handleDrop($event, rowIndex) : null"
          >
            <td
              v-if="props.selectable"
              :class="{
                'vt-table__td--pinned-left': true,
              }"
              :style="getSelectionColumnStyle()"
              class="vt-table__td vt-table__td--selection"
            >
              <div class="vt-table__cell-content">
                <VCheckbox
                  :checked="selectionComposable?.isRowSelected(row)"
                  @change="(isChecked, event) => handleCheckboxChange(isChecked, row, event)"
                />
              </div>
            </td>

            <td
              v-if="props.rowDraggable && props.showDragHandle"
              :class="{
                'vt-table__td--pinned-left': true,
              }"
              :style="getDragHandleColumnStyle()"
              class="vt-table__td vt-table__td--drag-handle"
            >
              <div class="vt-table__cell-content vt-table__drag-handle">
                <VIcon name="columnsMove" />
              </div>
            </td>

            <td
              v-for="(col, colIndex) in sortedColumns"
              :key="`${createRowKey(row, rowIndex)}-${col.prop}`"
              :ref="el => setColumnRef(el as HTMLElement, col.prop)"
              :class="[
                'vt-table__td',
                {
                  'vt-table__td--pinned-left': col.pinnedLeft,
                  'vt-table__td--pinned-right': col.pinnedRight,
                  'vt-table__td--manage': col.manage,
                },
              ]"
              :style="getColumnStyleWithContext(col, colIndex)"
            >
              <div
                v-tooltip="col.showOverflowTooltip ? getTooltipText(row, col) : null"
                class="vt-table__cell-content vt-table__cell-content--ellipsis"
              >
                <component
                  :is="col.renderSlot"
                  v-if="col.renderSlot"
                  :column="col"
                  :index="rowIndex"
                  :row="row"
                  :value="row[col.prop]"
                />
                <span v-else>{{ row[col.prop] }}</span>
              </div>
              <div
                v-if="!col.manage"
                :data-resizer="col.prop"
                class="vt-table__resizer"
                @mousedown="e => handleMouseDown(e, col)"
              />
            </td>
          </tr>
          <tr
            :class="{
              'vt-table__row--insert-after': dragComposable?.shouldShowInsertLine(rowIndex, 'after'),
            }"
          ></tr>
        </template>
      </tbody>

      <tfoot v-if="shouldShowSummary" class="vt-table__summary">
        <tr>
          <td
            v-if="props.selectable"
            :class="{
              'vt-table__td--pinned-left': true,
            }"
            :style="getSelectionColumnFooterStyle()"
            class="vt-table__td"
          >
            <div class="vt-table__cell-content vt-table__cell-content--summary"></div>
          </td>

          <td
            v-if="props.rowDraggable && props.showDragHandle"
            :class="{
              'vt-table__td--pinned-left': true,
            }"
            :style="getDragHandleFooterStyle()"
            class="vt-table__td"
          >
            <div class="vt-table__cell-content vt-table__cell-content--summary"></div>
          </td>

          <td
            v-for="(col, colIndex) in sortedColumns"
            :key="col.prop"
            :class="[
              'vt-table__td',
              {
                'vt-table__td--pinned-left': col.pinnedLeft,
                'vt-table__td--pinned-right': col.pinnedRight,
                'vt-table__td--manage': col.manage,
              },
            ]"
            :style="getFooterStyleWithContext(col, colIndex)"
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
