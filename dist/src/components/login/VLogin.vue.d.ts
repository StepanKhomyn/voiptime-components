import type { VAuthentificationProps } from '@/components/login/types';
declare var __VLS_1: {}, __VLS_3: {}, __VLS_19: {};
type __VLS_Slots = {} & {
    logo?: (props: typeof __VLS_1) => any;
} & {
    greeting?: (props: typeof __VLS_3) => any;
} & {
    'language-select'?: (props: typeof __VLS_19) => any;
};
declare const __VLS_component: import("vue").DefineComponent<VAuthentificationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    auth: any;
}, string, import("vue").PublicProps, Readonly<VAuthentificationProps> & Readonly<{
    onAuth?: ((...args: any) => any) | undefined;
}>, {
    loading: boolean;
    privacyPolicyUrl: string;
    forgotPasswordUrl: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VLogin.vue.d.ts.map