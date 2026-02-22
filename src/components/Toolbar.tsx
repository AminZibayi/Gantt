import { FC, useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Download, Upload, ZoomIn, ZoomOut, Languages } from 'lucide-react';
import { parseExcel } from '../utils/excel';
import { exportToExcel, exportToPDF } from '../utils/export';
import { gantt } from '../vendor/dhtmlxgantt/dhtmlxgantt.es';

const Toolbar: FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, setSettings, setTasks, setLinks } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { tasks, links, errors } = await parseExcel(file);
      if (errors.length > 0) {
        alert("Import Errors:\n" + errors.join("\n"));
      } else {
        setTasks(tasks);
        setLinks(links);
        alert(t("Import Successful"));
      }
    } catch (err) {
      console.error(err);
      alert(t("Import Failed"));
    }
  };

  const handleExportExcel = () => {
    const { tasks, links } = useStore.getState();
    exportToExcel(tasks, links);
  };

  const handleExportPDF = () => {
    // Assuming container ID is implicit or we find it.
    // Wait, GanttChart doesn't have ID set explicitly on the div.
    // I need to set an ID on the Gantt container in GanttChart.tsx or use a class selector.
    // But exportToPDF takes an ID.
    // I'll set ID 'gantt-chart-container' in GanttChart.tsx
    // For now, let's assume I fix GanttChart.tsx too.
    exportToPDF('gantt-chart-container');
  };

  const toggleLocale = () => {
    const newLocale = settings.locale === 'en' ? 'fa' : 'en';
    const newDirection = newLocale === 'fa' ? 'rtl' : 'ltr';
    setSettings({ locale: newLocale, direction: newDirection });
    i18n.changeLanguage(newLocale);
  };

  const zoomIn = () => {
    if (gantt.ext && gantt.ext.zoom) {
        gantt.ext.zoom.zoomIn();
    } else {
        // Fallback or ignore
        console.warn("Zoom extension not available");
    }
  };

  const zoomOut = () => {
    if (gantt.ext && gantt.ext.zoom) {
        gantt.ext.zoom.zoomOut();
    } else {
        console.warn("Zoom extension not available");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">{settings.branding.title || t("gantt")}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={toggleLocale} className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1" title={t("Change Language")}>
          <Languages size={20} />
          <span className="text-sm font-medium">{settings.locale.toUpperCase()}</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded hover:bg-gray-100" title={t("Import")}>
          <Upload size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />

        <button onClick={handleExportExcel} className="p-2 rounded hover:bg-gray-100" title={t("Export Excel")}>
          <Download size={20} />
        </button>
        <button onClick={handleExportPDF} className="p-2 rounded hover:bg-gray-100" title={t("Export PDF")}>
          <span className="font-bold text-xs">PDF</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button onClick={zoomIn} className="p-2 rounded hover:bg-gray-100" title={t("Zoom In")}>
          <ZoomIn size={20} />
        </button>
        <button onClick={zoomOut} className="p-2 rounded hover:bg-gray-100" title={t("Zoom Out")}>
          <ZoomOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
