'use client';
import { useTranslations } from 'next-intl';
import { X, FileJson, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { GanttData, AppSettings } from '@/types';
import { exportJSON, exportCSV, exportExcel, printGantt } from '@/utils/exportUtils';

interface ExportMenuProps {
  ganttData: GanttData;
  settings: AppSettings;
  onClose: () => void;
}

export default function ExportMenu({ ganttData, settings, onClose }: ExportMenuProps) {
  const t = useTranslations();

  const actions = [
    {
      label: t('export.json'),
      icon: <FileJson size={20} className="text-indigo-600" />,
      onClick: () => { exportJSON(ganttData, settings); onClose(); },
      description: 'Full data with settings',
    },
    {
      label: t('export.csv'),
      icon: <FileText size={20} className="text-green-600" />,
      onClick: () => { exportCSV(ganttData); onClose(); },
      description: 'Tasks as comma-separated values',
    },
    {
      label: t('export.excel'),
      icon: <FileSpreadsheet size={20} className="text-emerald-600" />,
      onClick: () => { exportExcel(ganttData, settings).then(() => onClose()); },
      description: 'Tasks and links in Excel format',
    },
    {
      label: t('export.print'),
      icon: <Printer size={20} className="text-slate-600" />,
      onClick: () => { printGantt(); onClose(); },
      description: 'Print or save as PDF',
    },
  ];

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{t('export.title')}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
