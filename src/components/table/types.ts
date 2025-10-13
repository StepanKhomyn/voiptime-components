import type { Component, VNode } from 'vue';
import type { IconName } from '@/icons';

export interface VTableStyleConfig {
  [key: string]: string;
}

export type StickyPosition = 'left' | 'right';
export type SortDirection = 'asc' | 'desc';

export interface ResizeState {
  resizingCol: VTableColumnProps | null;
  startX: number;
  startWidth: number;
}

export interface SortState {
  prop: string;
  direction: SortDirection;
}

// Дані події сортування
export interface SortChangeEventData {
  column: VTableColumnProps;
  direction: SortDirection | null;
  prop: string;
  sortedData: Record<string, any>[];
}

// Дані події зміни виділення
export interface SelectionChangeEventData {
  selection: Record<string, any>[];
  row?: Record<string, any>;
  selected?: boolean;
  isAllSelected?: boolean;
}

// Дані події зміни порядку рядків
export interface RowReorderEventData {
  oldIndex: number;
  newIndex: number;
  row: Record<string, any>;
  newData: Record<string, any>[];
}

export interface VTableColumnGroup {
  name: string;
  label: string;
  order: number;
  icon?: IconName;
  color?: string;
  columns: VTableColumnProps[];
}

export type VTableRenderSlot = (props: {
  row: Record<string, any>;
  column: VTableColumnProps;
  value: any;
  index?: number;
}) => VNode | VNode[] | string | Component;

export interface VTableColumnProps {
  prop: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  pinnedLeft?: boolean;
  pinnedRight?: boolean;
  actionColumn?: boolean;
  showOverflowTooltip?: boolean;
  selectable?: boolean;
  renderSlot?: VTableRenderSlot;
  sortMethod?: Function;
}

export type VTableRowHighlightType = 'default' | 'success' | 'warning' | 'danger' | 'custom';

export interface VTableRowHighlight {
  type: VTableRowHighlightType;
  className?: string;
}

export type VTableRowHighlightFunction = (row: any, index: number) => VTableRowHighlight | null;

export interface VTableProps {
  data: Record<string, any>[];
  maxHeight?: number;
  rowKey?: string;
  defaultSort?: SortState;
  showSummary?: boolean;
  summaryMethod?: (params: { columns: VTableColumnProps[]; data: Record<string, any>[] }) => any[];
  columnsSelector?: VTableColumnGroup[];
  selectable?: boolean;
  isAllSelect?: boolean;
  selectionKey?: string;
  defaultSelection?: any[];
  selectOnClickRow?: boolean;
  highlightCurrentRow?: boolean;
  allData?: Record<string, any>[];
  columns?: VTableColumnProps[];
  hideHeader?: boolean;
  rowHighlight?: VTableRowHighlightFunction;

  // Нові пропси для drag & drop
  /** Дозволити перетягування рядків */
  rowDraggable?: boolean;
  /** Показувати handle для перетягування */
  showDragHandle?: boolean;
}

export interface VTableEmits {
  'sort-change': [payload: SortChangeEventData];
  'selection-change': [payload: SelectionChangeEventData];
  'current-change': [
    payload: {
      currentRow: Record<string, any> | null;
      oldCurrentRow: Record<string, any> | null;
    },
  ];
  'row-click': [payload: { row: Record<string, any>; column: VTableColumnProps; event: Event }];
  'update:columns': [payload: VTableColumnProps[]];
  'column-pin': [payload: { column: VTableColumnProps; position: 'left' | 'right' | 'none' }];
  'column-resize': [payload: { column: VTableColumnProps; width: number; oldWidth?: number }];
  'column-visibility': [payload: { column: VTableColumnProps }];
  'column-sort': [payload: { column: VTableColumnProps; direction: 'asc' | 'desc' | null }];
  'columns-change': [columns: VTableColumnProps[]];
  'infinity-scroll': [];
  'row-reorder': [payload: RowReorderEventData];
  'update:data': [data: Record<string, any>[]];
}

export const DEFAULT_COLUMN_CONFIG = {
  sortable: true,
  actionColumn: false,
  showOverflowTooltip: true,
  visible: true,
  pinnedLeft: false,
  pinnedRight: false,
} as const;
