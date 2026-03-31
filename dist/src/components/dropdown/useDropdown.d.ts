import { type Ref } from 'vue';
interface DropdownPosition {
    top: string;
    left: string;
    minWidth?: string;
    transformOrigin: string;
}
interface DropdownOptions {
    trigger?: 'hover' | 'click';
    placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
    showTimeout?: number;
    hideTimeout?: number;
    disabled?: boolean;
    hideOnClick?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onScroll?: () => void;
}
interface UseDropdownReturn {
    visible: Ref<boolean>;
    parentVisible: Ref<boolean>;
    wasVisibleBeforeHiding: Ref<boolean>;
    dropdownPosition: Ref<DropdownPosition>;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    updatePosition: () => Promise<void>;
    checkParentVisibility: () => void;
    addScrollListeners: () => void;
    removeScrollListeners: () => void;
}
export declare function useDropdown(triggerRef: Ref<HTMLElement | undefined>, dropdownRef: Ref<HTMLElement | undefined>, options?: DropdownOptions): UseDropdownReturn;
export {};
//# sourceMappingURL=useDropdown.d.ts.map