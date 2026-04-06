export interface DragState {
    draggedIndex: number | null;
    draggedRow: Record<string, any> | null;
    targetIndex: number | null;
    isDragging: boolean;
    insertPosition: 'before' | 'after' | null;
}
export declare function useRowDrag(getData: () => Record<string, any>[], emit: (...args: any[]) => void): {
    dragState: import("vue").Ref<{
        draggedIndex: number | null;
        draggedRow: Record<string, any> | null;
        targetIndex: number | null;
        isDragging: boolean;
        insertPosition: "before" | "after" | null;
    }, DragState | {
        draggedIndex: number | null;
        draggedRow: Record<string, any> | null;
        targetIndex: number | null;
        isDragging: boolean;
        insertPosition: "before" | "after" | null;
    }>;
    handleDragStart: (event: DragEvent, row: Record<string, any>, index: number) => void;
    handleDragOver: (event: DragEvent, index: number) => void;
    handleDragEnter: (event: DragEvent, index: number) => void;
    handleDragLeave: (event: DragEvent) => void;
    handleDrop: (event: DragEvent, targetIndex: number) => void;
    handleDragEnd: (event: DragEvent) => void;
    shouldShowInsertLine: (index: number, position: "before" | "after") => boolean;
};
//# sourceMappingURL=useRowDrag.d.ts.map