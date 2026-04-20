import type { VTableColumnGroup, VTableColumnProps } from '@/components/table/types';
interface Props {
    columns: VTableColumnProps[];
    defaultColumns?: VTableColumnProps[];
    columnsSelector?: VTableColumnGroup[];
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update-columns": (columns: VTableColumnProps[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate-columns"?: ((columns: VTableColumnProps[]) => any) | undefined;
}>, {
    columnsSelector: VTableColumnGroup[];
    defaultColumns: VTableColumnProps[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VTableColumnSelector.vue.d.ts.map