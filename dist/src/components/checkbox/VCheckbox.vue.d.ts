import type { VCheckboxProps } from './types';
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = {} & {
    label?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_3) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VCheckboxProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (value: boolean, event: Event) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<VCheckboxProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: boolean, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    required: boolean;
    disabled: boolean;
    modelValue: boolean;
    size: "small" | "medium" | "large";
    checked: boolean;
    indeterminate: boolean;
    variant: "primary" | "success" | "warning" | "danger" | "info";
    isDouble: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VCheckbox.vue.d.ts.map