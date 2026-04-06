import type { ComputedRef } from 'vue';
import type { VTableProps } from '../types';
export declare function useTableSelection(props: VTableProps, sortedData: ComputedRef<Record<string, any>[]>, emit: (event: string, payload: any) => void, allData?: ComputedRef<Record<string, any>[]>): {
    selectedRows: import("vue").Ref<Record<string, any>[], Record<string, any>[]>;
    currentRow: import("vue").Ref<Record<string, any> | null, Record<string, any> | null>;
    isRowSelected: (row: Record<string, any>) => boolean;
    isAllSelected: ComputedRef<boolean>;
    isIndeterminate: ComputedRef<boolean>;
    isDoubleCheck: ComputedRef<boolean>;
    isFullSelection: import("vue").Ref<boolean, boolean>;
    toggleRowSelection: (row: Record<string, any>, selected?: boolean) => void;
    toggleAllSelection: () => void;
    clearSelection: () => void;
    setCurrentRow: (row: Record<string, any> | null) => void;
    getSelectionRows: () => Record<string, any>[];
    setSelectionRows: (rows: Record<string, any>[]) => void;
    selectAbsolutelyAll: () => void;
};
//# sourceMappingURL=selection.d.ts.map