import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { GanttTask, ImportError, ImportResult } from '@/types';

const REQUIRED_COLUMNS = ['text', 'start_date', 'duration'];
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{4}\/\d{2}\/\d{2}$/,
];

function isValidDate(value: string): boolean {
  return DATE_PATTERNS.some((p) => p.test(value)) && !isNaN(Date.parse(value));
}

function normalizeDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [m, d, y] = value.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    return value.replace(/\//g, '-');
  }
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return value;
}

function validateRows(rows: Record<string, string>[]): {
  tasks: GanttTask[];
  errors: ImportError[];
  warnings: ImportError[];
} {
  const errors: ImportError[] = [];
  const warnings: ImportError[] = [];
  const tasks: GanttTask[] = [];

  if (rows.length === 0) {
    errors.push({ type: 'error', message: 'File is empty or has no data rows' });
    return { tasks, errors, warnings };
  }

  const headers = Object.keys(rows[0]).map((h) => h.trim().toLowerCase());
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push({ type: 'error', message: `Missing required column: ${col}` });
    }
  }
  if (errors.length > 0) return { tasks, errors, warnings };

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const text = row['text']?.trim();
    const startDate = row['start_date']?.trim();
    const durationStr = row['duration']?.trim();

    if (!text) {
      warnings.push({
        type: 'warning',
        message: `Empty task name in row ${rowNum}`,
        row: rowNum,
        column: 'text',
      });
    }
    if (!startDate) {
      errors.push({
        type: 'error',
        message: `Missing start_date in row ${rowNum}`,
        row: rowNum,
        column: 'start_date',
      });
    } else if (!isValidDate(startDate)) {
      warnings.push({
        type: 'warning',
        message: `Possibly invalid date format in row ${rowNum}: "${startDate}"`,
        row: rowNum,
        column: 'start_date',
      });
    }
    if (!durationStr) {
      errors.push({
        type: 'error',
        message: `Missing duration in row ${rowNum}`,
        row: rowNum,
        column: 'duration',
      });
    } else {
      const durationNum = Number(durationStr);
      if (isNaN(durationNum) || durationNum <= 0) {
        errors.push({
          type: 'error',
          message: `Invalid duration in row ${rowNum}: "${durationStr}"`,
          row: rowNum,
          column: 'duration',
        });
      }
    }

    const durationNum = Number(durationStr);
    const progress = row['progress'] ? Number(row['progress']) : 0;
    tasks.push({
      id: row['id'] ? String(row['id']) : String(index + 1),
      text: text || `Task ${rowNum}`,
      start_date: startDate
        ? normalizeDate(startDate)
        : new Date().toISOString().split('T')[0],
      duration: isNaN(durationNum) ? 1 : durationNum || 1,
      progress: isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress)),
      parent: row['parent'] ? String(row['parent']) : undefined,
      color: row['color'] || undefined,
    });
  });

  return { tasks, errors, warnings };
}

export async function parseCSV(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        const { tasks, errors, warnings } = validateRows(rows);
        resolve({ data: tasks, links: [], errors, warnings });
      },
      error: (error) => {
        resolve({
          data: [],
          links: [],
          errors: [{ type: 'error', message: `CSV parse error: ${error.message}` }],
          warnings: [],
        });
      },
    });
  });
}

export async function parseExcel(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          resolve({ data: [], links: [], errors: [{ type: 'error', message: 'No worksheets found in file' }], warnings: [] });
          return;
        }
        const rows: Record<string, string>[] = [];
        let headers: string[] = [];
        worksheet.eachRow((row, rowNum) => {
          const values = (row.values as (string | number | null)[]).slice(1); // index 0 is undefined in exceljs
          if (rowNum === 1) {
            headers = values.map((v) => String(v ?? '').trim().toLowerCase());
          } else {
            const rowObj: Record<string, string> = {};
            headers.forEach((h, i) => {
              rowObj[h] = String(values[i] ?? '');
            });
            rows.push(rowObj);
          }
        });
        const { tasks, errors, warnings } = validateRows(rows);
        resolve({ data: tasks, links: [], errors, warnings });
      } catch (err) {
        resolve({
          data: [],
          links: [],
          errors: [{ type: 'error', message: `Excel parse error: ${String(err)}` }],
          warnings: [],
        });
      }
    };
    reader.onerror = () => {
      resolve({
        data: [],
        links: [],
        errors: [{ type: 'error', message: 'Failed to read file' }],
        warnings: [],
      });
    };
    reader.readAsArrayBuffer(file);
  });
}
