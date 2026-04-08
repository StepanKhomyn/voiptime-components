import type { VTableColumnGroup, VTableColumnProps } from './types';
interface ColumnActionsProps {
    column: VTableColumnProps;
    allColumns: VTableColumnProps[];
    defaultColumns?: VTableColumnProps[];
    columnsSelector?: VTableColumnGroup[] | undefined;
}
declare const _default: import("vue").DefineComponent<ColumnActionsProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update-columns": (columns: VTableColumnProps[]) => any;
    pin: (column: VTableColumnProps, position: "left" | "right" | "none") => any;
}, string, import("vue").PublicProps, Readonly<ColumnActionsProps> & Readonly<{
    "onUpdate-columns"?: ((columns: VTableColumnProps[]) => any) | undefined;
    onPin?: ((column: VTableColumnProps, position: "left" | "right" | "none") => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=ColumnActions.vue.d.ts.map