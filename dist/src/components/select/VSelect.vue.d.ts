import type { VtSelectOption, VtSelectProps } from '@/components/select/types';
declare var __VLS_8: {
    option: VtSelectOption;
}, __VLS_23: {};
type __VLS_Slots = {} & {
    selected?: (props: typeof __VLS_8) => any;
} & {
    default?: (props: typeof __VLS_23) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VtSelectProps, {
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
    focus(): void;
    blur(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getSelectedOptions(): VtSelectOption[];
    getValidationState(): {
        isValid: boolean;
        errors: string[];
    };
    setFilter(query: string): void;
    clearFilter(): void;
    getFilterQuery(): string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<VtSelectProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    loading: boolean;
    multiple: boolean;
    clearable: boolean;
    filterable: boolean;
    placeholder: string;
    noDataText: string;
    loadingText: string;
    maxHeight: number;
    maxOptionsHeight: number;
    collapsedTags: boolean;
    validateOnInput: boolean;
    validateOnBlur: boolean;
    placement: string;
    trigger: string;
    showTimeout: number;
    hideTimeout: number;
    status: "default" | "success" | "warning" | "error";
    outlined: boolean;
    filterPlaceholder: string;
    allowRemoteFilter: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VSelect.vue.d.ts.map