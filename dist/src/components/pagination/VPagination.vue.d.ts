import type { PaginationProps } from './types';
declare const _default: import("vue").DefineComponent<PaginationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:currentPage": (page: number) => any;
    "update:pageSize": (size: number) => any;
    pageChange: (data: import("./types").PaginationChangeData) => any;
    reloadData: (page: number) => any;
}, string, import("vue").PublicProps, Readonly<PaginationProps> & Readonly<{
    "onUpdate:currentPage"?: ((page: number) => any) | undefined;
    "onUpdate:pageSize"?: ((size: number) => any) | undefined;
    onPageChange?: ((data: import("./types").PaginationChangeData) => any) | undefined;
    onReloadData?: ((page: number) => any) | undefined;
}>, {
    pageSize: number;
    currentPage: number;
    pageSizeOptions: number[];
    maxVisiblePages: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VPagination.vue.d.ts.map