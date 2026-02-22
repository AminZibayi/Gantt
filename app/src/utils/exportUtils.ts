import Papa from 'papaparse';
import * as XLSX from 'xlsx';
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

export function exportExcel(data: GanttData, settings: AppSettings): void {
  const rows = data.data.map((task) => ({
    ID: task.id,
    'Task Name': task.text,
    'Start Date': task.start_date,
    Duration: task.duration,
    Progress: task.progress ?? 0,
    Parent: task.parent ?? '',
    Color: task.color ?? '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.sheet_add_aoa(
    ws,
    [[`${settings.branding.companyName} - Gantt Chart Export`]],
    { origin: 'A1' }
  );
  XLSX.utils.sheet_add_json(ws, rows, { origin: 'A3' });

  XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

  const linksRows = data.links.map((link) => ({
    ID: link.id,
    Source: link.source,
    Target: link.target,
    Type: link.type,
  }));
  if (linksRows.length > 0) {
    const wsLinks = XLSX.utils.json_to_sheet(linksRows);
    XLSX.utils.book_append_sheet(wb, wsLinks, 'Links');
  }

  XLSX.writeFile(wb, 'gantt-data.xlsx');
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
