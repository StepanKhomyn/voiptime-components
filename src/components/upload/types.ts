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

  (e: 'parse', result: { file: UploadFile; result: ParseResult }): void;

  (e: 'rowsExceed', data: { file: UploadFile; rows: number; maxRows: number }): void;
}

export interface UploadError {
  type: 'size' | 'type' | 'count' | 'parse';
  message: string;
  file?: File;
}

export class FileValidator {
  static validateSize(file: File, maxSize?: number): boolean {
    if (!maxSize) return true;
    return file.size <= maxSize;
  }

  static validateType(file: File, accept?: string): boolean {
    if (!accept) return true;

    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileMimeType = file.type;

    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      if (type.includes('/*')) {
        const baseType = type.split('/')[0];
        return fileMimeType.startsWith(baseType);
      }
      return fileMimeType === type;
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class FileParser {
  private static worker: Worker | null = null;

  static isDataFile(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['csv', 'xls', 'xlsx'].includes(ext || '');
  }

  static async parseFile(
    file: File,
    maxRows?: number,
    returnData = false,
    onProgress?: (progress: number) => void
  ): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      // Створюємо worker
      if (!this.worker) {
        this.worker = new Worker(new URL('./parser.worker.ts', import.meta.url), {
          type: 'module',
        });
      }

      this.worker.onmessage = e => {
        if (e.data.type === 'progress') {
          onProgress?.(e.data.progress);
        } else if (e.data.type === 'result') {
          resolve(e.data.result);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error));
        }
      };

      this.worker.onerror = error => {
        reject(error);
      };

      // Відправляємо файл у worker
      this.worker.postMessage({
        type: 'parse',
        file,
        maxRows,
        returnData,
      });
    });
  }
}
