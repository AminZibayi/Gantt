'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useGanttData } from '@/hooks/useGanttData';
import { useSettings } from '@/hooks/useSettings';
import { useImport } from '@/hooks/useImport';
import Header from '@/components/Header';
import ImportModal from '@/components/ImportModal';
import ExportMenu from '@/components/ExportMenu';
import BrandingSettings from '@/components/BrandingSettings';
import YamlEditor from '@/components/YamlEditor';
import { GanttData } from '@/types';

const GanttChart = dynamic(() => import('@/components/GanttChart'), { ssr: false });

export default function GanttPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const { ganttData, isLoaded, updateData, importData } = useGanttData();
  const {
    settings,
    isLoaded: settingsLoaded,
    updateSettings,
    updateBranding,
    setTaskColor,
  } = useSettings();
  const { isProcessing, importResult, processFile, clearResult } = useImport();

  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showYaml, setShowYaml] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'i':
            e.preventDefault();
            setShowImport(true);
            break;
          case 'e':
            e.preventDefault();
            setShowExport(true);
            break;
          case 'p':
            e.preventDefault();
            window.print();
            break;
          case 'y':
            e.preventDefault();
            setShowYaml(true);
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImportConfirm = useCallback(
    (data: GanttData) => {
      importData(data);
      setShowImport(false);
      clearResult();
      toast.success(t('import.success'));
    },
    [importData, clearResult, t]
  );

  if (!isLoaded || !settingsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Print header */}
      <div className="print-header p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          {settings.branding.logo && (
            <img
              src={settings.branding.logo}
              alt="Logo"
              className="h-12 w-auto"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {settings.branding.companyName}
            </h1>
            <p className="text-gray-600">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>

      <Header
        settings={settings}
        locale={locale}
        onImport={() => setShowImport(true)}
        onExport={() => setShowExport(true)}
        onSettings={() => setShowSettings(true)}
        onYaml={() => setShowYaml(true)}
        onPrint={() => window.print()}
        ganttData={ganttData}
      />

      <main className="flex-1 p-4 overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden gantt-container">
          <GanttChart
            data={ganttData}
            settings={settings}
            locale={locale}
            onDataChange={updateData}
            onTaskColorChange={setTaskColor}
          />
        </div>
      </main>

      {showImport && (
        <ImportModal
          isProcessing={isProcessing}
          importResult={importResult}
          onFileSelect={processFile}
          onConfirm={handleImportConfirm}
          onClose={() => {
            setShowImport(false);
            clearResult();
          }}
        />
      )}

      {showExport && (
        <ExportMenu
          ganttData={ganttData}
          settings={settings}
          onClose={() => setShowExport(false)}
        />
      )}

      {showSettings && (
        <BrandingSettings
          settings={settings}
          onUpdate={updateBranding}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showYaml && (
        <YamlEditor
          ganttData={ganttData}
          settings={settings}
          onApply={(data, newSettings) => {
            updateData(data);
            if (newSettings) updateSettings(newSettings);
            setShowYaml(false);
            toast.success(t('yaml.success'));
          }}
          onClose={() => setShowYaml(false)}
        />
      )}
    </div>
  );
}
