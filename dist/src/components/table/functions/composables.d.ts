import type { ResizeState, StickyPosition, VTableColumnProps, VTableProps, VTableStyleConfig } from '../types';
/**
 * Композабл для роботи з колонками таблиці
 */
export declare function useTableColumns(columns: VTableColumnProps[]): {
    sortedColumns: import("vue").ComputedRef<VTableColumnProps[]>;
    getDefaultColumnWidth: () => number;
    getStickyOffset: (side: StickyPosition, index: number, hasSelectable?: boolean) => number;
};
/**
 * Композабл для генерації стилів таблиці
 */
export declare function useTableStyles(props: VTableProps): {
    getTableWrapperStyle: () => VTableStyleConfig;
    getColumnStyle: (col: VTableColumnProps, index: number, getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number, getDefaultColumnWidth: () => number) => VTableStyleConfig;
    getHeaderStyle: (col: VTableColumnProps, index: number, getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number, getDefaultColumnWidth: () => number) => VTableStyleConfig;
    getFooterStyle: (col: VTableColumnProps, index: number, getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number, getDefaultColumnWidth: () => number) => VTableStyleConfig;
};
/**
 * Композабл для ресайзу колонок
 */
export declare function useColumnResize(): {
    onMouseDown: (e: MouseEvent, col: VTableColumnProps, getDefaultColumnWidth: (prop: string) => number, callback?: (newWidth: number) => void) => void;
    resizeState: import("vue").Ref<{
        resizingCol: {
            prop: string;
            label: string;
            width?: number | undefined;
            minWidth?: number | undefined;
            maxWidth?: number | undefined;
            sortable?: boolean | undefined;
            pinnedLeft?: boolean | undefined;
            pinnedRight?: boolean | undefined;
            actionColumn?: boolean | undefined;
            showOverflowTooltip?: boolean | undefined;
            selectable?: boolean | undefined;
            manage?: boolean | undefined;
            renderSlot?: import("../types").VTableRenderSlot | undefined;
            sortMethod?: Function | undefined;
        } | null;
        startX: number;
        startWidth: number;
    }, ResizeState | {
        resizingCol: {
            prop: string;
            label: string;
            width?: number | undefined;
            minWidth?: number | undefined;
            maxWidth?: number | undefined;
            sortable?: boolean | undefined;
            pinnedLeft?: boolean | undefined;
            pinnedRight?: boolean | undefined;
            actionColumn?: boolean | undefined;
            showOverflowTooltip?: boolean | undefined;
            selectable?: boolean | undefined;
            manage?: boolean | undefined;
            renderSlot?: import("../types").VTableRenderSlot | undefined;
            sortMethod?: Function | undefined;
        } | null;
        startX: number;
        startWidth: number;
    }>;
};
//# sourceMappingURL=composables.d.ts.map