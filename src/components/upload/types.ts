// types.ts
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

// Клас для роботи з Worker Pool
export class WorkerPool {
  private worker: Worker | null = null;
  private resolveMap = new Map<number, { resolve: (value: any) => void; reject: (error: any) => void }>();
  private messageId = 0;

  constructor() {
    this.initWorker();
  }

  async parseFile(file: File, maxRows?: number, returnData = false): Promise<ParseResult> {
    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const arrayBuffer = await file.arrayBuffer();
    const id = this.messageId++;

    return new Promise((resolve, reject) => {
      this.resolveMap.set(id, { resolve, reject });

      this.worker!.postMessage(
        {
          id,
          type: 'parse',
          file: {
            name: file.name,
            arrayBuffer,
          },
          maxRows,
          returnData,
        },
        [arrayBuffer]
      );
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.resolveMap.clear();
  }

  private initWorker() {
    try {
      // Створюємо worker з окремого файлу використовуючи правильний синтаксис для Vite
      // Додаємо ?worker до шляху для Vite
      const workerUrl = new URL('./parser.worker.ts', import.meta.url);
      this.worker = new Worker(workerUrl, { type: 'module' });

      this.worker.onmessage = (e: MessageEvent) => {
        const { id, type, result, error } = e.data;
        const callbacks = this.resolveMap.get(id);

        if (callbacks) {
          if (type === 'success') {
            callbacks.resolve(result);
          } else if (type === 'error') {
            callbacks.reject(new Error(error));
          }
          this.resolveMap.delete(id);
        }
      };

      this.worker.onerror = error => {
        console.error('Worker error:', error);
        this.resolveMap.forEach(({ reject }) => {
          reject(new Error('Worker error occurred'));
        });
        this.resolveMap.clear();
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
    }
  }
}

export class FileParser {
  private static workerPool: WorkerPool | null = null;

  static getWorkerPool(): WorkerPool {
    if (!this.workerPool) {
      this.workerPool = new WorkerPool();
    }
    return this.workerPool;
  }

  static isDataFile(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['csv', 'xls', 'xlsx'].includes(ext || '');
  }

  static async parseFile(file: File, maxRows?: number, returnData = false): Promise<ParseResult> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!['csv', 'xls', 'xlsx'].includes(ext || '')) {
      throw new Error('Unsupported file format');
    }

    const workerPool = this.getWorkerPool();
    return workerPool.parseFile(file, maxRows, returnData);
  }

  static terminateWorkers() {
    if (this.workerPool) {
      this.workerPool.terminate();
      this.workerPool = null;
    }
  }
}
