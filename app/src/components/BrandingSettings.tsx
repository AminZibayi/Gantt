'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, Upload, Trash2 } from 'lucide-react';
import { AppSettings } from '@/types';
import { TASK_COLORS } from '@/constants/defaults';

interface BrandingSettingsProps {
  settings: AppSettings;
  onUpdate: (branding: Partial<AppSettings['branding']>) => void;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onClose: () => void;
}

export default function BrandingSettings({
  settings,
  onUpdate,
  onUpdateSettings,
  onClose,
}: BrandingSettingsProps) {
  const t = useTranslations();
  const [companyName, setCompanyName] = useState(settings.branding.companyName);
  const [primaryColor, setPrimaryColor] = useState(settings.branding.primaryColor);
  const [calendarType, setCalendarType] = useState(settings.calendarType);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate({ companyName, primaryColor });
    onUpdateSettings({ calendarType });
    onClose();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdate({ logo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.title')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Branding section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              {t('settings.branding')}
            </h3>

            {/* Company name */}
            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium text-slate-700">
                {t('settings.companyName')}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Primary color */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-slate-700">
                {t('settings.primaryColor')}
              </label>
              <div className="flex flex-wrap gap-2">
                {TASK_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${
                      primaryColor === color
                        ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{t('settings.logo')}</label>
              <div className="flex items-center gap-3">
                {settings.branding.logo ? (
                  <>
                    <img
                      src={settings.branding.logo}
                      alt="Logo"
                      className="h-10 w-auto rounded border border-slate-200"
                    />
                    <button
                      onClick={() => onUpdate({ logo: null })}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      {t('settings.removeLogo')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Upload size={15} />
                    {t('settings.uploadLogo')}
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>

          {/* Calendar section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              {t('settings.calendar')}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setCalendarType('gregorian')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border transition-colors ${
                  calendarType === 'gregorian'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('settings.gregorian')}
              </button>
              <button
                onClick={() => setCalendarType('jalali')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border transition-colors ${
                  calendarType === 'jalali'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('settings.jalali')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t('import.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            {t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
