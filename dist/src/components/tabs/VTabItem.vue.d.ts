declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    name: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: StringConstructor;
    disabled: BooleanConstructor;
    closable: BooleanConstructor;
    icon: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: StringConstructor;
    disabled: BooleanConstructor;
    closable: BooleanConstructor;
    icon: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    closable: boolean;
    forceRender: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VTabItem.vue.d.ts.map