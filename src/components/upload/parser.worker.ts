import * as XLSX from 'xlsx';

interface WorkerMessage {
  type: 'parse';
  file: File;
  maxRows?: number;
  returnData: boolean;
}

interface ProgressMessage {
  type: 'progress';
  progress: number;
}

interface ResultMessage {
  type: 'result';
  result: any;
}

interface ErrorMessage {
  type: 'error';
  error: string;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { file, maxRows, returnData } = e.data;

  try {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const result = await parseCSV(file, maxRows, returnData);
      self.postMessage({ type: 'result', result } as ResultMessage);
    } else if (ext === 'xls' || ext === 'xlsx') {
      const result = await parseExcel(file, maxRows, returnData);
      self.postMessage({ type: 'result', result } as ResultMessage);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ErrorMessage);
  }
};

async function parseCSV(file: File, maxRows?: number, returnData = false) {
  const text = await file.text();
  self.postMessage({ type: 'progress', progress: 30 } as ProgressMessage);

  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length === 0) throw new Error('File is empty');

  const headers = parseCSVLine(lines[0]);
  const rows = lines.length - 1;

  self.postMessage({ type: 'progress', progress: 50 } as ProgressMessage);

  const result: any = {
    name: file.name,
    rows,
    columns: headers,
  };

  if (returnData) {
    const rowsToRead = maxRows ? Math.min(rows, maxRows) : rows;
    const data: any[] = [];

    for (let i = 1; i <= rowsToRead; i++) {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => (row[header] = values[idx] || ''));
      data.push(row);

      if (i % 500 === 0) {
        const progress = 50 + Math.floor((i / rowsToRead) * 40);
        self.postMessage({ type: 'progress', progress } as ProgressMessage);
      }
    }

    result.data = data;
  }

  self.postMessage({ type: 'progress', progress: 90 } as ProgressMessage);

  return {
    sheets: [{ ...result, name: 'CSV' }],
    ...result,
  };
}

function parseCSVLine(line: string): string[] {
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

async function parseExcel(file: File, maxRows?: number, returnData = false) {
  const arrayBuffer = await file.arrayBuffer();
  self.postMessage({ type: 'progress', progress: 30 } as ProgressMessage);

  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellStyles: false,
    cellDates: false,
  });

  self.postMessage({ type: 'progress', progress: 60 } as ProgressMessage);

  const sheets: any[] = [];

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

    const sheetResult: any = {
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
        raw: false,
      });

      sheetResult.data = json.slice(0, rowsToRead);
    }

    sheets.push(sheetResult);
  }

  self.postMessage({ type: 'progress', progress: 90 } as ProgressMessage);

  const first = sheets[0] || { rows: 0, columns: [] };

  return {
    sheets,
    rows: first.rows,
    columns: first.columns,
    data: first.data,
  };
}
