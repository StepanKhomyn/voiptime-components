// types.ts - розширена версія з підтримкою виділення та v-model

export interface VTableStyleConfig {
  [key: string]: string;
}

export type StickyPosition = 'left' | 'right';
export type SortDirection = 'asc' | 'desc';

export interface ResizeState {
  resizingCol: VTableColumn | null;
  startX: number;
  startWidth: number;
}

export interface SortState {
  prop: string;
  direction: SortDirection;
}

// Дані події сортування
export interface SortChangeEventData {
  column: VTableColumn;
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
  icon?: string;
  color?: string;
  columns: VTableColumn[];
}

export interface VTableProps {
  data: Record<string, any>[];
  maxHeight?: number;
  defaultSort?: SortState;
  showSummary?: boolean;
  summaryMethod?: (params: { columns: VTableColumn[]; data: Record<string, any>[] }) => any[];
  columnsSelector?: VTableColumn[];
  // Пропси для виділення
  selectable?: boolean;
  selectionKey?: string; // ключ для ідентифікації рядків (за замовчуванням 'id')
  defaultSelection?: any[]; // рядки виділені за замовчуванням
  selectOnClickRow?: boolean; // виділяти рядок при кліку на нього
  highlightCurrentRow?: boolean; // підсвічувати поточний рядок

  // Додаткові пропси для повного вибору
  allData?: Record<string, any>[]; // всі дані для повного виділення

  // Опціональний v-model для колонок
  columns?: VTableColumnGroup[];
}

export interface VTableColumn {
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

  // Додаємо підтримку слотів
  renderSlot?: Function;
}

export const DEFAULT_COLUMN_CONFIG = {
  sortable: true,
  actionColumn: false,
  showOverflowTooltip: true,
  visible: true,
  pinnedLeft: false,
  pinnedRight: false,
};

export interface VTableEmits {
  'sort-change': SortChangeEventData;
  'selection-change': SelectionChangeEventData;
  'current-change': {
    currentRow: Record<string, any> | null;
    oldCurrentRow: Record<string, any> | null;
  };
  'row-click': {
    row: Record<string, any>;
    column: VTableColumn;
    event: Event;
  };

  // v-model емітери (опціональні)
  'update:columns': VTableColumn[];

  // Події для колонок
  'column-pin': { column: VTableColumn; position: 'left' | 'right' | 'none' };
  'column-resize': { column: VTableColumn; width: number; oldWidth?: number };
  'column-visibility': { column: VTableColumn };
  'column-sort': { column: VTableColumn; direction: 'asc' | 'desc' | null };
  'columns-change': [columns: VTableColumn[]];
}
