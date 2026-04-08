import type { SidebarItemRaw } from './types';
type __VLS_Props = {
    items: SidebarItemRaw[];
    collapsed: boolean;
    currentRoute?: string | null;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    navigate: (to: string) => any;
    "update:collapsed": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNavigate?: ((to: string) => any) | undefined;
    "onUpdate:collapsed"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VSidebar.vue.d.ts.map