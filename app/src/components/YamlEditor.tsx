'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertCircle } from 'lucide-react';
import yaml from 'js-yaml';
import { GanttData, AppSettings } from '@/types';

interface YamlEditorProps {
  ganttData: GanttData;
  settings: AppSettings;
  onApply: (data: GanttData, settings?: Partial<AppSettings>) => void;
  onClose: () => void;
}

export default function YamlEditor({
  ganttData,
  settings,
  onApply,
  onClose,
}: YamlEditorProps) {
  const t = useTranslations();
  const initialValue = yaml.dump({ tasks: ganttData, settings }, { indent: 2 });
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    try {
      const parsed = yaml.load(value) as {
        tasks?: GanttData;
        settings?: Partial<AppSettings>;
      };
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid YAML structure');
      }
      const data: GanttData = parsed.tasks || ganttData;
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Missing or invalid tasks.data array');
      }
      setError(null);
      onApply(data, parsed.settings);
    } catch (e) {
      setError(String(e));
    }
  };

  const handleReset = () => {
    setValue(yaml.dump({ tasks: ganttData, settings }, { indent: 2 }));
    setError(null);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t('yaml.title')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('yaml.description')}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            className="w-full h-full min-h-[400px] font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 flex items-start gap-2 p-3 bg-red-50 rounded-xl">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 font-mono">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t('yaml.reset')}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {t('import.cancel')}
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {t('yaml.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
