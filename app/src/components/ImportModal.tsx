'use client';
import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Upload, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { ImportResult, GanttData } from '@/types';

interface ImportModalProps {
  isProcessing: boolean;
  importResult: ImportResult | null;
  onFileSelect: (file: File) => Promise<ImportResult>;
  onConfirm: (data: GanttData) => void;
  onClose: () => void;
}

export default function ImportModal({
  isProcessing,
  importResult,
  onFileSelect,
  onConfirm,
  onClose,
}: ImportModalProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      await onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const hasErrors = importResult && importResult.errors.length > 0;
  const hasWarnings = importResult && importResult.warnings.length > 0;
  const canImport = importResult && importResult.data.length > 0;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t('import.title')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('import.description')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Dropzone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload size={32} className="mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-slate-600">{t('import.dropzone')}</p>
            <p className="text-xs text-slate-400 mt-2">{t('import.columns')}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Processing */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm text-blue-700">{t('import.validating')}</span>
            </div>
          )}

          {/* Results */}
          {importResult && !isProcessing && (
            <>
              {/* Preview count */}
              {canImport && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    {t('import.preview', { count: importResult.data.length })}
                  </span>
                </div>
              )}

              {/* Errors */}
              {hasErrors && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-red-700 flex items-center gap-1.5">
                    <AlertCircle size={16} />
                    {t('import.errors')} ({importResult.errors.length})
                  </h3>
                  <div className="bg-red-50 rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto">
                    {importResult.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600">
                        {err.row ? `Row ${err.row}: ` : ''}{err.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {hasWarnings && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle size={16} />
                    {t('import.warnings')} ({importResult.warnings.length})
                  </h3>
                  <div className="bg-amber-50 rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto">
                    {importResult.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600">
                        {w.row ? `Row ${w.row}: ` : ''}{w.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t('import.cancel')}
          </button>
          {canImport && (
            <button
              onClick={() =>
                onConfirm({ data: importResult!.data, links: importResult!.links })
              }
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {t('import.confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
