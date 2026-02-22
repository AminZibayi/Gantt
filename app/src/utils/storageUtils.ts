import { GanttData, AppSettings } from '@/types';
import { DEFAULT_TASKS, DEFAULT_SETTINGS } from '@/constants/defaults';

const STORAGE_KEYS = {
  GANTT_DATA: 'gantt_data',
  APP_SETTINGS: 'app_settings',
};

export function saveGanttData(data: GanttData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GANTT_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save gantt data:', e);
  }
}

export function loadGanttData(): GanttData {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GANTT_DATA);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load gantt data:', e);
  }
  return DEFAULT_TASKS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        branding: { ...DEFAULT_SETTINGS.branding, ...parsed.branding },
      };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GANTT_DATA);
    localStorage.removeItem(STORAGE_KEYS.APP_SETTINGS);
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
}
