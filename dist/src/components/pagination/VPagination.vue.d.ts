import type { PaginationProps } from './types';
declare const _default: import("vue").DefineComponent<PaginationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:currentPage": any;
    "update:pageSize": any;
    pageChange: any;
    reloadData: any;
}, string, import("vue").PublicProps, Readonly<PaginationProps> & Readonly<{
    "onUpdate:currentPage"?: ((...args: any) => any) | undefined;
    "onUpdate:pageSize"?: ((...args: any) => any) | undefined;
    onPageChange?: ((...args: any) => any) | undefined;
    onReloadData?: ((...args: any) => any) | undefined;
}>, {
    pageSize: number;
    currentPage: number;
    pageSizeOptions: number[];
    maxVisiblePages: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VPagination.vue.d.ts.map