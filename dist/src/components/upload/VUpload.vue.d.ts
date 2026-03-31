import type { UploadFile, VUploadProps } from './types';
declare const _default: import("vue").DefineComponent<VUploadProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: any;
    error: any;
    "update:modelValue": any;
    remove: any;
    exceed: any;
    parse: any;
    rowsExceed: any;
}, string, import("vue").PublicProps, Readonly<VUploadProps> & Readonly<{
    onChange?: ((...args: any) => any) | undefined;
    onError?: ((...args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any) => any) | undefined;
    onRemove?: ((...args: any) => any) | undefined;
    onExceed?: ((...args: any) => any) | undefined;
    onParse?: ((...args: any) => any) | undefined;
    onRowsExceed?: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: UploadFile[];
    multiple: boolean;
    placeholder: string;
    type: "drag" | "button";
    accept: string;
    maxSize: number;
    maxFiles: number;
    maxRows: number;
    tip: string;
    parseFiles: boolean;
    returnData: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VUpload.vue.d.ts.map