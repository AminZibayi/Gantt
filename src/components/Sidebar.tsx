import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Settings as SettingsIcon, X } from 'lucide-react';

const Sidebar: FC = () => {
  const { t } = useTranslation();
  const { settings, setSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandingChange = (key: string, value: string) => {
    setSettings({
      branding: { ...settings.branding, [key]: value }
    });
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50"
           style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{t("settings")}</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Branding Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t("branding")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t("title")}</label>
                <input
                  type="text"
                  value={settings.branding.title}
                  onChange={(e) => handleBrandingChange('title', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t("logo")}</label>
                <input
                  type="text"
                  value={settings.branding.logoUrl}
                  onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t("primary_color")}</label>
                <input
                  type="color"
                  value={settings.branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="mt-1 block w-full h-10 p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t("theme")}</h3>
            <div className="space-y-2">
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ theme: e.target.value as any })}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                <option value="material">Material</option>
                <option value="skyblue">Skyblue</option>
                <option value="terrace">Terrace</option>
              </select>
            </div>
          </div>

          {/* Direction Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t("direction")}</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={settings.direction === 'ltr'}
                  onChange={() => setSettings({ direction: 'ltr' })}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{t("ltr")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={settings.direction === 'rtl'}
                  onChange={() => setSettings({ direction: 'rtl' })}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{t("rtl")}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 z-40 transition-all duration-300"
          title={t("settings")}
        >
          <SettingsIcon size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
