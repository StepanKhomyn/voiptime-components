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

  static async parseFile(file: File, maxRows?: number, returnData = false): Promise<ParseResult> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const result = await this.parseCSV(file, maxRows, returnData);
      return {
        sheets: [{ ...result, name: 'CSV' }],
        ...result,
      };
    }

    if (ext === 'xls' || ext === 'xlsx') {
      return this.parseExcel(file, maxRows, returnData);
    }

    throw new Error('Unsupported file format');
  }

  private static async parseCSV(file: File, maxRows?: number, returnData = false): Promise<SheetParseResult> {
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length === 0) throw new Error('File is empty');

    const headers = this.parseCSVLine(lines[0]);
    const rows = lines.length - 1;

    const result: SheetParseResult = {
      name: file.name,
      rows,
      columns: headers,
    };

    if (returnData) {
      const rowsToRead = maxRows ? Math.min(rows, maxRows) : rows;
      const data: any[] = [];

      for (let i = 1; i <= rowsToRead; i++) {
        const values = this.parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => (row[header] = values[idx] || ''));
        data.push(row);
      }

      result.data = data;
    }

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

  private static async parseExcel(file: File, maxRows?: number, returnData = false): Promise<ParseResult> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheets: SheetParseResult[] = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

      const totalRows = range.e.r; // без заголовка
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
        const json = XLSX.utils.sheet_to_json(worksheet, {
          range: 1,
          header: headers,
          defval: '',
        });

        sheetResult.data = json.slice(0, rowsToRead);
      }

      sheets.push(sheetResult);
    }

    const first = sheets[0] || { rows: 0, columns: [] };

    return {
      sheets,
      rows: first.rows,
      columns: first.columns,
      data: first.data,
    };
  }
}
