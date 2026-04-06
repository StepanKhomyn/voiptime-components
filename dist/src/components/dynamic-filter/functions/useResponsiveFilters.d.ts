import { type Ref } from 'vue';
export declare function useResponsiveFilters(containerRef: Ref<HTMLElement | null>, actionsRef: Ref<HTMLElement | null>, dropdownTriggerRef: Ref<HTMLElement | null>, measurementContainerRef: Ref<HTMLElement | null>, slotNodesLength: Ref<number>): {
    visibleIndexes: Ref<number[], number[]>;
    calculate: () => void;
    scheduleCalculate: () => void;
    forceRecalculate: () => void;
};
//# sourceMappingURL=useResponsiveFilters.d.ts.map