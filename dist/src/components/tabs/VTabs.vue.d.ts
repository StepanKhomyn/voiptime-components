import type { VTabsProps } from './types';
declare var __VLS_17: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_17) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VTabsProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string) => any;
    "tab-change": (value: string) => any;
    "tab-remove": (name: string) => any;
    "tab-add": () => any;
}, string, import("vue").PublicProps, Readonly<VTabsProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    "onTab-change"?: ((value: string) => any) | undefined;
    "onTab-remove"?: ((name: string) => any) | undefined;
    "onTab-add"?: (() => any) | undefined;
}>, {
    modelValue: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VTabs.vue.d.ts.map