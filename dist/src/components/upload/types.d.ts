export interface UploadFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}
export interface SheetParseResult {
    name: string;
    rows: number;
    columns: string[];
    data?: any[];
}
export interface ParseResult {
    sheets: SheetParseResult[];
    rows: number;
    columns: string[];
    data?: any[];
}
export interface VUploadProps {
    modelValue?: UploadFile[];
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    maxRows?: number;
    multiple?: boolean;
    type?: 'drag' | 'button';
    disabled?: boolean;
    placeholder?: string;
    tip?: string;
    parseFiles?: boolean;
    returnData?: boolean;
}
export interface VUploadEmits {
    (e: 'update:modelValue', files: UploadFile[]): void;
    (e: 'change', files: UploadFile[]): void;
    (e: 'remove', file: UploadFile): void;
    (e: 'exceed', files: File[]): void;
    (e: 'error', error: UploadError): void;
    (e: 'parse', result: {
        file: UploadFile;
        result: ParseResult;
    }): void;
    (e: 'rowsExceed', data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }): void;
}
export interface UploadError {
    type: 'size' | 'type' | 'count' | 'parse';
    message: string;
    file?: File;
}
export declare class FileValidator {
    static validateSize(file: File, maxSize?: number): boolean;
    static validateType(file: File, accept?: string): boolean;
    static formatFileSize(bytes: number): string;
    static generateId(): string;
}
export declare class WorkerPool {
    private worker;
    private resolveMap;
    private messageId;
    constructor();
    parseFile(file: File, maxRows?: number, returnData?: boolean): Promise<ParseResult>;
    terminate(): void;
    private initWorker;
}
export declare class FileParser {
    private static workerPool;
    static getWorkerPool(): WorkerPool;
    static isDataFile(file: File): boolean;
    static parseFile(file: File, maxRows?: number, returnData?: boolean): Promise<ParseResult>;
    static terminateWorkers(): void;
}
//# sourceMappingURL=types.d.ts.map