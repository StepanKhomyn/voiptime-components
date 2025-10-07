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

export interface VUploadProps {
  modelValue?: UploadFile[];
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  type?: 'drag' | 'button';
  disabled?: boolean;
  placeholder?: string;
  tip?: string;
}

export interface VUploadEmits {
  (e: 'update:modelValue', files: UploadFile[]): void;

  (e: 'change', files: UploadFile[]): void;

  (e: 'remove', file: UploadFile): void;

  (e: 'exceed', files: File[]): void;

  (e: 'error', error: UploadError): void;
}

export interface UploadError {
  type: 'size' | 'type' | 'count';
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
