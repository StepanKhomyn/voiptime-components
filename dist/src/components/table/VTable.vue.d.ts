import type { VTableColumnProps, VTableProps } from './types';
type __VLS_Props = VTableProps;
type __VLS_PublicProps = __VLS_Props & {
    'columns'?: VTableColumnProps[] | undefined;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {
    toggleRowSelection: (row: Record<string, any>, selected?: boolean) => void;
    toggleAllSelection: () => void;
    selectAbsolutelyAll: () => void;
    clearSelection: () => void;
    getSelectionRows: () => Record<string, any>[];
    setSelectionRows: (rows: Record<string, any>[]) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "current-change": (payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }) => any;
    "selection-change": (payload: import("./types").SelectionChangeEventData) => any;
    "row-reorder": (payload: import("./types").RowReorderEventData) => any;
    "update:data": (data: Record<string, any>[]) => any;
    "sort-change": (payload: import("./types").SortChangeEventData) => any;
    "row-click": (payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any;
    "row-dblclick": (payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any;
    "update:columns": (...args: unknown[]) => any;
    "column-pin": (payload: {
        column: VTableColumnProps;
        position: "left" | "right" | "none";
    }) => any;
    "column-resize": (payload: {
        column: VTableColumnProps;
        width: number;
        oldWidth?: number;
    }) => any;
    "column-visibility": (payload: {
        column: VTableColumnProps;
    }) => any;
    "column-sort": (payload: {
        column: VTableColumnProps;
        direction: "asc" | "desc" | null;
    }) => any;
    "columns-change": (columns: VTableColumnProps[]) => any;
    "infinity-scroll": () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onCurrent-change"?: ((payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }) => any) | undefined;
    "onSelection-change"?: ((payload: import("./types").SelectionChangeEventData) => any) | undefined;
    "onRow-reorder"?: ((payload: import("./types").RowReorderEventData) => any) | undefined;
    "onUpdate:data"?: ((data: Record<string, any>[]) => any) | undefined;
    "onSort-change"?: ((payload: import("./types").SortChangeEventData) => any) | undefined;
    "onRow-click"?: ((payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any) | undefined;
    "onRow-dblclick"?: ((payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any) | undefined;
    "onUpdate:columns"?: ((...args: unknown[]) => any) | undefined;
    "onColumn-pin"?: ((payload: {
        column: VTableColumnProps;
        position: "left" | "right" | "none";
    }) => any) | undefined;
    "onColumn-resize"?: ((payload: {
        column: VTableColumnProps;
        width: number;
        oldWidth?: number;
    }) => any) | undefined;
    "onColumn-visibility"?: ((payload: {
        column: VTableColumnProps;
    }) => any) | undefined;
    "onColumn-sort"?: ((payload: {
        column: VTableColumnProps;
        direction: "asc" | "desc" | null;
    }) => any) | undefined;
    "onColumns-change"?: ((columns: VTableColumnProps[]) => any) | undefined;
    "onInfinity-scroll"?: (() => any) | undefined;
}>, {
    maxHeight: number | string;
    selectable: boolean;
    columns: VTableColumnProps[];
    columnsSelector: import("./types").VTableColumnGroup[];
    rowKey: string;
    showSummary: boolean;
    isAllSelect: boolean;
    selectionKey: string;
    defaultSelection: any[];
    selectOnClickRow: boolean;
    highlightCurrentRow: boolean;
    allData: Record<string, any>[];
    hideHeader: boolean;
    rowDraggable: boolean;
    showDragHandle: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VTable.vue.d.ts.map