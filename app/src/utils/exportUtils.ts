import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { GanttData, AppSettings } from '@/types';

export function exportJSON(data: GanttData, settings: AppSettings): void {
  const json = JSON.stringify({ tasks: data, settings }, null, 2);
  downloadFile(json, 'gantt-data.json', 'application/json');
}

export function exportCSV(data: GanttData): void {
  const rows = data.data.map((task) => ({
    id: task.id,
    text: task.text,
    start_date: task.start_date,
    duration: task.duration,
    progress: task.progress ?? 0,
    parent: task.parent ?? '',
    color: task.color ?? '',
  }));
  const csv = Papa.unparse(rows);
  downloadFile(csv, 'gantt-data.csv', 'text/csv');
}

export async function exportExcel(data: GanttData, settings: AppSettings): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = settings.branding.companyName;
  workbook.created = new Date();

  const tasksSheet = workbook.addWorksheet('Tasks');

  // Company header row
  tasksSheet.addRow([`${settings.branding.companyName} - Gantt Chart Export`]);
  tasksSheet.addRow([]);

  // Column headers
  tasksSheet.addRow(['ID', 'Task Name', 'Start Date', 'Duration', 'Progress', 'Parent', 'Color']);
  const headerRow = tasksSheet.getRow(3);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFF6FF' },
  };

  // Task data
  data.data.forEach((task) => {
    tasksSheet.addRow([
      task.id,
      task.text,
      task.start_date,
      task.duration,
      task.progress ?? 0,
      task.parent ?? '',
      task.color ?? '',
    ]);
  });

  tasksSheet.columns.forEach((col) => { col.width = 16; });

  // Links sheet
  if (data.links.length > 0) {
    const linksSheet = workbook.addWorksheet('Links');
    linksSheet.addRow(['ID', 'Source', 'Target', 'Type']);
    linksSheet.getRow(1).font = { bold: true };
    data.links.forEach((link) => {
      linksSheet.addRow([link.id, link.source, link.target, link.type]);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gantt-data.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printGantt(): void {
  window.print();
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
