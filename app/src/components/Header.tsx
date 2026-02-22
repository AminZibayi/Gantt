'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Download,
  Settings,
  FileCode,
  Printer,
  BarChart2,
} from 'lucide-react';
import { AppSettings, GanttData } from '@/types';
import { exportJSON, exportCSV, exportExcel, printGantt } from '@/utils/exportUtils';

interface HeaderProps {
  settings: AppSettings;
  locale: string;
  onImport: () => void;
  onExport: () => void;
  onSettings: () => void;
  onYaml: () => void;
  onPrint: () => void;
  ganttData: GanttData;
}

export default function Header({
  settings,
  locale,
  onImport,
  onExport,
  onSettings,
  onYaml,
  onPrint,
  ganttData,
}: HeaderProps) {
  const t = useTranslations();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3 min-w-0">
        {settings.branding.logo ? (
          <img
            src={settings.branding.logo}
            alt="Logo"
            className="h-8 w-auto flex-shrink-0"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: settings.branding.primaryColor }}
          >
            <BarChart2 size={18} className="text-white" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 truncate">
            {settings.branding.companyName}
          </h1>
          <p className="text-xs text-slate-500 truncate">{t('app.subtitle')}</p>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title={`${t('nav.import')} (Ctrl+I)`}
        >
          <Upload size={15} />
          <span className="hidden sm:inline">{t('nav.import')}</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title={`${t('nav.export')} (Ctrl+E)`}
        >
          <Download size={15} />
          <span className="hidden sm:inline">{t('nav.export')}</span>
        </button>

        <button
          onClick={onYaml}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title={`${t('nav.yaml')} (Ctrl+Y)`}
        >
          <FileCode size={15} />
          <span className="hidden sm:inline">{t('nav.yaml')}</span>
        </button>

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title={`${t('nav.print')} (Ctrl+P)`}
        >
          <Printer size={15} />
          <span className="hidden sm:inline">{t('nav.print')}</span>
        </button>

        <button
          onClick={onSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors"
          style={{ backgroundColor: settings.branding.primaryColor }}
          title={t('nav.settings')}
        >
          <Settings size={15} />
          <span className="hidden sm:inline">{t('nav.settings')}</span>
        </button>

        {/* Language switcher */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => switchLocale('en')}
            className={`px-2 py-1.5 text-xs font-medium transition-colors ${
              locale === 'en'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale('fa')}
            className={`px-2 py-1.5 text-xs font-medium transition-colors ${
              locale === 'fa'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            FA
          </button>
        </div>
      </div>
    </header>
  );
}
