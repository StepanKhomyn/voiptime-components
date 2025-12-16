import * as XLSX from 'xlsx';

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
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const result = await this.parseCSV(file, maxRows, returnData, onProgress);
      return {
        sheets: [{ ...result, name: 'CSV' }],
        ...result,
      };
    }

    if (ext === 'xls' || ext === 'xlsx') {
      return this.parseExcel(file, maxRows, returnData, onProgress);
    }

    throw new Error('Unsupported file format');
  }

  // Streaming CSV parser - не блокує UI
  private static async parseCSV(
    file: File,
    maxRows?: number,
    returnData = false,
    onProgress?: (progress: number) => void
  ): Promise<SheetParseResult> {
    const reader = file.stream().getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let lines: string[] = [];
    let headers: string[] = [];
    let totalBytesRead = 0;
    const fileSize = file.size;

    // Читаємо файл потоково
    while (true) {
      const { done, value } = await reader.read();

      if (value) {
        totalBytesRead += value.length;
        buffer += decoder.decode(value, { stream: !done });

        // Шукаємо символи нового рядка
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          lines.push(buffer.slice(0, newlineIndex));
          buffer = buffer.slice(newlineIndex + 1);
        }

        // Оновлюємо прогрес читання файлу (0-50%)
        const readProgress = Math.min(50, (totalBytesRead / fileSize) * 50);
        onProgress?.(readProgress);

        // Даємо браузеру подихати кожні 100KB
        if (totalBytesRead % (100 * 1024) < value.length) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      if (done) {
        if (buffer.trim()) {
          lines.push(buffer);
        }
        break;
      }
    }

    lines = lines.filter(l => l.trim());
    if (lines.length === 0) throw new Error('File is empty');

    headers = this.parseCSVLine(lines[0]);
    const rows = lines.length - 1;

    onProgress?.(60);

    const result: SheetParseResult = {
      name: file.name,
      rows,
      columns: headers,
    };

    if (returnData) {
      const rowsToRead = maxRows ? Math.min(rows, maxRows) : rows;
      const data: any[] = [];
      const chunkSize = 100;

      for (let i = 1; i <= rowsToRead; i++) {
        const values = this.parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => (row[header] = values[idx] || ''));
        data.push(row);

        if (i % chunkSize === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
          const progress = 60 + Math.floor((i / rowsToRead) * 30); // 60-90%
          onProgress?.(progress);
        }
      }

      result.data = data;
    }

    onProgress?.(90);
    return result;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }

    result.push(current.trim());
    return result;
  }

  // Оптимізований Excel parser
  private static async parseExcel(
    file: File,
    maxRows?: number,
    returnData = false,
    onProgress?: (progress: number) => void
  ): Promise<ParseResult> {
    // Читаємо файл частинами
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks: Uint8Array[] = [];
    let offset = 0;

    onProgress?.(10);

    while (offset < file.size) {
      const chunk = await file.slice(offset, offset + chunkSize).arrayBuffer();
      chunks.push(new Uint8Array(chunk));
      offset += chunkSize;

      // Оновлюємо прогрес читання (10-30%)
      const readProgress = 10 + Math.min(20, (offset / file.size) * 20);
      onProgress?.(readProgress);

      // Даємо браузеру подихати після кожного чанку
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Об'єднуємо всі чанки
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const arrayBuffer = new Uint8Array(totalLength);
    let position = 0;
    for (const chunk of chunks) {
      arrayBuffer.set(chunk, position);
      position += chunk.length;
    }

    onProgress?.(40);

    // Даємо браузеру подихати перед важкою операцією
    await new Promise(resolve => setTimeout(resolve, 10));

    // XLSX.read все одно блокує, але хоч файл вже в пам'яті
    const workbook = XLSX.read(arrayBuffer, {
      type: 'array',
      cellStyles: false, // Вимикаємо стилі для швидкості
      cellDates: false, // Вимикаємо дати для швидкості
    });

    onProgress?.(60);

    const sheets: SheetParseResult[] = [];

    for (let sheetIdx = 0; sheetIdx < workbook.SheetNames.length; sheetIdx++) {
      const sheetName = workbook.SheetNames[sheetIdx];
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

      const totalRows = range.e.r;
      const headers: string[] = [];

      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c });
        const cell = worksheet[addr];
        headers.push(cell ? String(cell.v) : `Column${c + 1}`);
      }

      const sheetResult: SheetParseResult = {
        name: sheetName,
        rows: totalRows,
        columns: headers,
      };

      if (returnData) {
        const rowsToRead = maxRows ? Math.min(totalRows, maxRows) : totalRows;

        await new Promise(resolve => setTimeout(resolve, 0));

        const json = XLSX.utils.sheet_to_json(worksheet, {
          range: 1,
          header: headers,
          defval: '',
          raw: false, // Повертаємо все як стрінги для швидкості
        });

        const sheetProgress = 60 + ((sheetIdx + 1) / workbook.SheetNames.length) * 25;
        onProgress?.(sheetProgress);

        sheetResult.data = json.slice(0, rowsToRead);
      }

      sheets.push(sheetResult);

      // Даємо браузеру подихати між sheets
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    onProgress?.(90);

    const first = sheets[0] || { rows: 0, columns: [] };

    return {
      sheets,
      rows: first.rows,
      columns: first.columns,
      data: first.data,
    };
  }
}
