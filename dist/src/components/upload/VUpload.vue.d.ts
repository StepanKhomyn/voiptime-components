import type { UploadError, UploadFile, VUploadProps } from './types';
declare const _default: import("vue").DefineComponent<VUploadProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (files: UploadFile[]) => any;
    error: (error: UploadError) => any;
    "update:modelValue": (files: UploadFile[]) => any;
    remove: (file: UploadFile) => any;
    exceed: (files: File[]) => any;
    parse: (result: {
        file: UploadFile;
        result: import("./types").ParseResult;
    }) => any;
    rowsExceed: (data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<VUploadProps> & Readonly<{
    onChange?: ((files: UploadFile[]) => any) | undefined;
    onError?: ((error: UploadError) => any) | undefined;
    "onUpdate:modelValue"?: ((files: UploadFile[]) => any) | undefined;
    onRemove?: ((file: UploadFile) => any) | undefined;
    onExceed?: ((files: File[]) => any) | undefined;
    onParse?: ((result: {
        file: UploadFile;
        result: import("./types").ParseResult;
    }) => any) | undefined;
    onRowsExceed?: ((data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }) => any) | undefined;
}>, {
    type: "drag" | "button";
    disabled: boolean;
    modelValue: UploadFile[];
    multiple: boolean;
    placeholder: string;
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