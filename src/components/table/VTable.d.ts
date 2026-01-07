// VTable.d.ts - експліцитна декларація типів для VTable компонента
import { DefineComponent } from 'vue';
import type { VTableColumnProps, VTableProps } from './types';

// Експліцитно декларуємо тип компонента VTable
declare const VTable: DefineComponent<
  VTableProps,
  {
    // Публічні методи компонента
    toggleRowSelection: (row: Record<string, any>, selected?: boolean) => void;
    toggleAllSelection: () => void;
    selectAbsolutelyAll: () => void;
    clearSelection: () => void;
    getSelectionRows: () => Record<string, any>[];
    setSelectionRows: (rows: Record<string, any>[]) => void;
    resetInfinityScroll: () => void;
  },
  {}, // data
  {}, // computed
  {}, // methods
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    // Events з явною типізацією
    'sort-change': (payload: import('./types').SortChangeEventData) => any;
    'selection-change': (payload: import('./types').SelectionChangeEventData) => any;
    'current-change': (payload: {
      currentRow: Record<string, any> | null;
      oldCurrentRow: Record<string, any> | null;
    }) => any;
    'row-click': (payload: { row: Record<string, any>; column: VTableColumnProps; event: Event }) => any;
    'row-dblclick': (payload: { row: Record<string, any>; column: VTableColumnProps; event: Event }) => any;
    'update:columns': (payload: VTableColumnProps[]) => any;
    'column-pin': (payload: { column: VTableColumnProps; position: 'left' | 'right' | 'none' }) => any;
    'column-resize': (payload: { column: VTableColumnProps; width: number; oldWidth?: number }) => any;
    'column-visibility': (payload: { column: VTableColumnProps }) => any;
    'column-sort': (payload: { column: VTableColumnProps; direction: 'asc' | 'desc' | null }) => any;
    'columns-change': (columns: VTableColumnProps[]) => any;
    'infinity-scroll': () => any;
  },
  string,
  import('vue').PublicProps,
  Readonly<VTableProps> &
    Readonly<{
      // Event listeners
      'onSort-change'?: ((payload: import('./types').SortChangeEventData) => any) | undefined;
      'onSelection-change'?: ((payload: import('./types').SelectionChangeEventData) => any) | undefined;
      'onCurrent-change'?:
        | ((payload: { currentRow: Record<string, any> | null; oldCurrentRow: Record<string, any> | null }) => any)
        | undefined;
      'onRow-click'?:
        | ((payload: { row: Record<string, any>; column: VTableColumnProps; event: Event }) => any)
        | undefined;
      'onRow-dblclick'?:
        | ((payload: { row: Record<string, any>; column: VTableColumnProps; event: Event }) => any)
        | undefined;
      'onUpdate:columns'?: ((payload: VTableColumnProps[]) => any) | undefined;
      'onColumn-pin'?:
        | ((payload: { column: VTableColumnProps; position: 'left' | 'right' | 'none' }) => any)
        | undefined;
      'onColumn-resize'?:
        | ((payload: { column: VTableColumnProps; width: number; oldWidth?: number }) => any)
        | undefined;
      'onColumn-visibility'?: ((payload: { column: VTableColumnProps }) => any) | undefined;
      'onColumn-sort'?: ((payload: { column: VTableColumnProps; direction: 'asc' | 'desc' | null }) => any) | undefined;
      'onColumns-change'?: ((columns: VTableColumnProps[]) => any) | undefined;
      'onInfinity-scroll'?: (() => any) | undefined;
    }>,
  {
    // Default values
    selectable: false;
    selectOnClickRow: false;
    highlightCurrentRow: false;
    showSummary: false;
    selectionKey: string;
    defaultSelection: any[];
    columnsSelector: import('./types').VTableColumnGroup[];
    columns: VTableColumnProps[];
  },
  {}, //
  {}, //
  {}, //
  string,
  import('vue').ComponentProvideOptions,
  false,
  {
    // Refs
    tableWrapperRef: HTMLDivElement;
  },
  HTMLDivElement
>;

export default VTable;
