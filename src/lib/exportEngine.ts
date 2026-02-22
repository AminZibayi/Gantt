import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import * as yaml from "js-yaml";
import type { GanttData, ExportOptions, BrandingConfig } from "../types";

function getGanttElement(): HTMLElement | null {
  return document.querySelector(".gantt_container") || document.getElementById("gantt-area");
}

export async function exportToPNG(branding: BrandingConfig, options: ExportOptions): Promise<void> {
  const el = getGanttElement();
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0f1117",
    logging: false,
  });

  if (options.includeBranding && branding.companyName) {
    const headerH = 120;
    const nc = document.createElement("canvas");
    nc.width = canvas.width;
    nc.height = canvas.height + headerH;
    const ctx = nc.getContext("2d")!;
    ctx.fillStyle = branding.primaryColor;
    ctx.fillRect(0, 0, nc.width, headerH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px Vazirmatn, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(branding.companyName, nc.width / 2, headerH / 2 + 12);
    ctx.drawImage(canvas, 0, headerH);
    downloadCanvas(nc, options.fileName || "gantt-chart.png");
  } else {
    downloadCanvas(canvas, options.fileName || "gantt-chart.png");
  }
}

function downloadCanvas(canvas: HTMLCanvasElement, fileName: string) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportToPDF(branding: BrandingConfig, options: ExportOptions): Promise<void> {
  const el = getGanttElement();
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const isLandscape = options.orientation === "landscape";
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: options.pageSize.toLowerCase() as "a4" | "a3",
  });

  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const m = 10;
  let y = m;

  if (options.includeBranding && branding.companyName) {
    pdf.setFillColor(branding.primaryColor);
    pdf.rect(0, 0, pw, 20, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text(branding.companyName, pw / 2, 13, { align: "center" });
    y = 25;
  }

  const imgW = pw - m * 2;
  const imgH = (canvas.height * imgW) / canvas.width;
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", m, y, imgW, Math.min(imgH, ph - y - m));
  pdf.save(options.fileName || "gantt-chart.pdf");
}

export function exportToExcel(data: GanttData, fileName?: string) {
  const rows = data.data.map((t) => ({
    ID: t.id,
    "Task Name / نام فعالیت": t.text,
    "Start Date / تاریخ شروع": t.start_date,
    "Duration / مدت": t.duration,
    "Progress / پیشرفت": t.progress ? `${Math.round(t.progress * 100)}%` : "0%",
    "Parent / والد": t.parent || "",
    "Type / نوع": t.type || "task",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gantt Data");
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String((r as Record<string, unknown>)[key] || "").length)) + 2,
  }));
  ws["!cols"] = colWidths;
  XLSX.writeFile(wb, fileName || "gantt-data.xlsx");
}

export function exportToCSV(data: GanttData, fileName?: string) {
  const rows = data.data.map((t) => ({
    id: t.id,
    text: t.text,
    start_date: t.start_date,
    duration: t.duration,
    progress: t.progress,
    parent: t.parent || "",
    type: t.type || "task",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  downloadText(csv, fileName || "gantt-data.csv", "text/csv");
}

export function exportToJSON(data: GanttData, fileName?: string) {
  downloadText(JSON.stringify(data, null, 2), fileName || "gantt-data.json", "application/json");
}

export function exportToYAML(data: GanttData, fileName?: string) {
  const y = yaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true });
  downloadText(y, fileName || "gantt-data.yaml", "text/yaml");
}

function downloadText(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportData(format: string, data: GanttData, branding: BrandingConfig, options: ExportOptions) {
  switch (format) {
    case "pdf":
      return exportToPDF(branding, options);
    case "png":
      return exportToPNG(branding, options);
    case "excel":
      return exportToExcel(data, options.fileName);
    case "csv":
      return exportToCSV(data, options.fileName);
    case "json":
      return exportToJSON(data, options.fileName);
    case "yaml":
      return exportToYAML(data, options.fileName);
  }
}
