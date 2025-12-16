// parser.worker.ts
import * as XLSX from 'xlsx';

interface WorkerMessage {
  id: number;
  type: 'parse';
  file: {
    name: string;
    arrayBuffer: ArrayBuffer;
  };
  maxRows?: number;
  returnData: boolean;
}

interface SheetParseResult {
  name: string;
  rows: number;
  columns: string[];
  data?: any[];
}

interface ParseResult {
  sheets: SheetParseResult[];
  rows: number;
  columns: string[];
  data?: any[];
}

class WorkerFileParser {
  static isCSV(fileName: string): boolean {
    return fileName.split('.').pop()?.toLowerCase() === 'csv';
  }

  static isExcel(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'xls' || ext === 'xlsx';
  }

  static async parseFile(
    fileName: string,
    arrayBuffer: ArrayBuffer,
    maxRows?: number,
    returnData = false
  ): Promise<ParseResult> {
    if (this.isCSV(fileName)) {
      const result = await this.parseCSV(fileName, arrayBuffer, maxRows, returnData);
      return {
        sheets: [{ ...result, name: 'CSV' }],
        ...result,
      };
    }

    if (this.isExcel(fileName)) {
      return this.parseExcel(arrayBuffer, maxRows, returnData);
    }

    throw new Error('Unsupported file format');
  }

  private static async parseCSV(
    fileName: string,
    arrayBuffer: ArrayBuffer,
    maxRows?: number,
    returnData = false
  ): Promise<SheetParseResult> {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer);
    const lines = text.split('\n').filter(l => l.trim());

    if (lines.length === 0) throw new Error('File is empty');

    const headers = this.parseCSVLine(lines[0]);
    const rows = lines.length - 1;

    const result: SheetParseResult = {
      name: fileName,
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

  private static parseExcel(arrayBuffer: ArrayBuffer, maxRows?: number, returnData = false): ParseResult {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheets: SheetParseResult[] = [];

    for (const sheetName of workbook.SheetNames) {
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

// Обробка повідомлень від основного потоку
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { id, type, file, maxRows, returnData } = e.data;

  try {
    if (type === 'parse') {
      const result = await WorkerFileParser.parseFile(file.name, file.arrayBuffer, maxRows, returnData);

      self.postMessage({
        id,
        type: 'success',
        result,
      });
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
