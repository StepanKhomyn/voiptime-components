import type { CollapseItemProps } from './types';
declare var __VLS_1: {
    isActive: boolean;
    title: string | undefined;
}, __VLS_17: {};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_17) => any;
};
declare const __VLS_component: import("vue").DefineComponent<CollapseItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    toggle: (name: string) => any;
}, string, import("vue").PublicProps, Readonly<CollapseItemProps> & Readonly<{
    onToggle?: ((name: string) => any) | undefined;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VCollapseItem.vue.d.ts.map