import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Task, Link } from '../store';

export const exportToExcel = (tasks: Task[], links: Link[], fileName: string = 'gantt_data.xlsx') => {
  const wb = XLSX.utils.book_new();

  const wsTasks = XLSX.utils.json_to_sheet(tasks);
  XLSX.utils.book_append_sheet(wb, wsTasks, "Tasks");

  const wsLinks = XLSX.utils.json_to_sheet(links);
  XLSX.utils.book_append_sheet(wb, wsLinks, "Links");

  XLSX.writeFile(wb, fileName);
};

export const exportToPDF = async (elementId: string, fileName: string = 'gantt_chart.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Improve quality
      useCORS: true, // Allow external images (branding)
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height] // Match canvas size for now, or use A4
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  } catch (err) {
    console.error("Export to PDF failed", err);
  }
};
