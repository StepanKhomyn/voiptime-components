import type { VModalProps } from './types';
declare var __VLS_12: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_12) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VModalProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: any;
    "update:modelValue": any;
}, string, import("vue").PublicProps, Readonly<VModalProps> & Readonly<{
    onClose?: ((...args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any) => any) | undefined;
}>, {
    size: import("./types").VModalSize;
    zIndex: number;
    closeOnBackdropClick: boolean;
    showCloseButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VModal.vue.d.ts.map