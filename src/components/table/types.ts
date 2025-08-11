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
  // Додаємо підтримку слотів
  renderSlot?: VTableRenderSlot;
  sortMethod?: Function;
}

// Явно типізуємо props interface
export interface VTableProps {
  /** Масив даних для відображення в таблиці */
  data: Record<string, any>[];
  /** Максимальна висота таблиці (для sticky header) */
  maxHeight?: number;
  /** Початкове сортування */
  defaultSort?: SortState;
  /** Показувати підсумковий рядок */
  showSummary?: boolean;
  /** Метод для обчислення підсумкових значень */
  summaryMethod?: (params: { columns: VTableColumnProps[]; data: Record<string, any>[] }) => any[];
  /** Групи колонок для селектора */
  columnsSelector?: VTableColumnGroup[];

  // Пропси для виділення
  /** Чи включити функціонал виділення рядків */
  selectable?: boolean;
  /** Ключ для ідентифікації рядків (за замовчуванням 'id') */
  selectionKey?: string;
  /** Рядки виділені за замовчуванням */
  defaultSelection?: any[];
  /** Виділяти рядок при кліку на нього */
  selectOnClickRow?: boolean;
  /** Підсвічувати поточний рядок */
  highlightCurrentRow?: boolean;

  // Додаткові пропси для повного вибору
  /** Всі дані для повного виділення (якщо відрізняються від data) */
  allData?: Record<string, any>[];

  // Опціональний v-model для колонок
  /** Конфігурація колонок */
  columns?: VTableColumnProps[];
}

// Явно типізуємо emits interface
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
}

export const DEFAULT_COLUMN_CONFIG = {
  sortable: true,
  actionColumn: false,
  showOverflowTooltip: true,
  visible: true,
  pinnedLeft: false,
  pinnedRight: false,
} as const;
