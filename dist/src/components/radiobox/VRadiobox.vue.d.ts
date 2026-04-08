import type { VRadioboxProps } from './types';
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = {} & {
    label?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_3) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VRadioboxProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (value: any, event: Event) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: any) => any;
}, string, import("vue").PublicProps, Readonly<VRadioboxProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: any, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}>, {
    required: boolean;
    disabled: boolean;
    modelValue: any;
    size: "small" | "medium" | "large";
    checked: boolean;
    variant: "primary" | "success" | "warning" | "danger" | "info";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VRadiobox.vue.d.ts.map