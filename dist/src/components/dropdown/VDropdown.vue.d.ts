import { type DropdownProps, type DropdownTriggerType } from './types';
declare var __VLS_1: {}, __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    dropdown?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<DropdownProps, {
    show: () => void;
    hide: () => void;
    visible: import("vue").Ref<boolean, boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
    "visible-change": (visible: boolean) => any;
    scrolled: () => any;
    command: (command: string | number) => any;
}, string, import("vue").PublicProps, Readonly<DropdownProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
    "onVisible-change"?: ((visible: boolean) => any) | undefined;
    onScrolled?: (() => any) | undefined;
    onCommand?: ((command: string | number) => any) | undefined;
}>, {
    disabled: boolean;
    maxHeight: string | number;
    placement: import("./types").DropdownPlacement;
    trigger: DropdownTriggerType;
    showTimeout: number;
    hideTimeout: number;
    hideOnClick: boolean;
    background: string;
    hoverBackground: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VDropdown.vue.d.ts.map