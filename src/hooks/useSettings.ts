import { useLocalStorage } from "./useLocalStorage";
import type { AppSettings } from "../types";

const defaultSettings: AppSettings = {
  language: "fa",
  calendar: "jalali",
  theme: "material",
  colorScheme: "dark",
  zoomLevel: "month",
  showGrid: true,
  showLinks: true,
  showProgress: true,
  showToday: true,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>("settings", defaultSettings);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return { settings, setSettings, updateSetting, resetSettings };
}
