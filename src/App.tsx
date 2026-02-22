import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header/Header";
import Toolbar from "./components/Toolbar/Toolbar";
import GanttChart from "./components/GanttChart/GanttChart";
import type { GanttChartRef } from "./components/GanttChart/GanttChart";
import ImportDialog from "./components/ImportDialog/ImportDialog";
import ExportDialog from "./components/ExportDialog/ExportDialog";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import { useGanttData } from "./hooks/useGanttData";
import { useSettings } from "./hooks/useSettings";
import { useBranding } from "./hooks/useBranding";
import { getColorForIndex } from "./config/defaultData";
import type { GanttData, AppSettings } from "./types";

const ZOOM_LEVELS: AppSettings["zoomLevel"][] = ["day", "week", "month", "quarter", "year"];

export default function App() {
  const { i18n } = useTranslation();
  const { data, setData, importData, getNextId } = useGanttData();
  const { settings, updateSetting } = useSettings();
  const { branding, updateBranding, setLogo, removeLogo } = useBranding();
  const ganttChartRef = useRef<GanttChartRef>(null);

  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync language, direction, HTML attributes, and color scheme
  const currentLang = settings.language;
  const dir = currentLang === "fa" ? "rtl" : "ltr";

  // Apply to document
  document.documentElement.lang = currentLang;
  document.documentElement.dir = dir;
  document.documentElement.setAttribute("data-color-scheme", settings.colorScheme ?? "dark");

  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === "fa" ? "en" : "fa";
    updateSetting("language", newLang);
    i18n.changeLanguage(newLang);
    // Also switch calendar automatically
    updateSetting("calendar", newLang === "fa" ? "jalali" : "gregorian");
  }, [currentLang, updateSetting, i18n]);

  const handleDataChange = useCallback(
    (newData: GanttData) => {
      setData(newData);
    },
    [setData]
  );

  const handleImport = useCallback(
    (importedData: GanttData) => {
      importData(importedData);
    },
    [importData]
  );

  const handleAddTask = useCallback(() => {
    const newId = getNextId();
    const colorDef = getColorForIndex(newId);
    const newTask = {
      id: newId,
      text: currentLang === "fa" ? "فعالیت جدید" : "New Task",
      start_date: new Date().toISOString().split("T")[0],
      duration: 3,
      progress: 0,
      color: colorDef.color,
      textColor: colorDef.textColor,
      progressColor: colorDef.progressColor,
      open: true,
    };
    setData((prev) => ({
      ...prev,
      data: [...prev.data, newTask],
    }));
  }, [getNextId, currentLang, setData]);

  const handleZoomIn = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(settings.zoomLevel);
    if (idx > 0) updateSetting("zoomLevel", ZOOM_LEVELS[idx - 1]);
  }, [settings.zoomLevel, updateSetting]);

  const handleZoomOut = useCallback(() => {
    const idx = ZOOM_LEVELS.indexOf(settings.zoomLevel);
    if (idx < ZOOM_LEVELS.length - 1) updateSetting("zoomLevel", ZOOM_LEVELS[idx + 1]);
  }, [settings.zoomLevel, updateSetting]);

  const handleExpandAll = useCallback(() => {
    setData((prev) => ({
      ...prev,
      data: prev.data.map((t) => ({ ...t, open: true })),
    }));
  }, [setData]);

  const handleCollapseAll = useCallback(() => {
    setData((prev) => ({
      ...prev,
      data: prev.data.map((t) => ({ ...t, open: false })),
    }));
  }, [setData]);

  const handleToday = useCallback(() => {
    ganttChartRef.current?.scrollToToday();
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className='app-layout' dir={dir}>
      {/* Print header for exported documents */}
      <div className='print-header'>
        {branding.logoUrl && <img src={branding.logoUrl} alt='Logo' className='print-header-logo' />}
        <div>
          <div className='print-header-title'>{branding.companyName || "Gantt Chart"}</div>
          <div className='print-header-company'>
            {new Date().toLocaleDateString(currentLang === "fa" ? "fa-IR" : "en-US")}
          </div>
        </div>
      </div>

      <Header
        branding={branding}
        language={currentLang}
        colorScheme={settings.colorScheme ?? "dark"}
        onToggleLanguage={toggleLanguage}
        onToggleColorScheme={() => updateSetting("colorScheme", settings.colorScheme === "light" ? "dark" : "light")}
        onOpenSettings={() => setShowSettings(true)}
      />

      <Toolbar
        onAddTask={handleAddTask}
        onImport={() => setShowImport(true)}
        onExport={() => setShowExport(true)}
        onPrint={handlePrint}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onToday={handleToday}
        zoomLevel={settings.zoomLevel}
      />

      <div className='app-main'>
        <GanttChart
          key={`${settings.language}-${settings.calendar}-${settings.zoomLevel}`}
          ref={ganttChartRef}
          data={data}
          settings={settings}
          onDataChange={handleDataChange}
        />
      </div>

      {showImport && <ImportDialog onClose={() => setShowImport(false)} onImport={handleImport} />}

      {showExport && <ExportDialog data={data} branding={branding} onClose={() => setShowExport(false)} />}

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        branding={branding}
        data={data}
        onUpdateSetting={updateSetting}
        onUpdateBranding={updateBranding}
        onSetLogo={setLogo}
        onRemoveLogo={removeLogo}
        onImportData={importData}
      />
    </div>
  );
}
