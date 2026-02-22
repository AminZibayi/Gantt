'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '@/types';
import { saveSettings, loadSettings } from '@/utils/storageUtils';
import { DEFAULT_SETTINGS } from '@/constants/defaults';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const updateBranding = useCallback(
    (branding: Partial<AppSettings['branding']>) => {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          branding: { ...prev.branding, ...branding },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    []
  );

  const setTaskColor = useCallback(
    (taskId: string | number, color: string) => {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          taskColors: { ...prev.taskColors, [taskId]: color },
        };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    []
  );

  return {
    settings,
    isLoaded,
    updateSettings,
    updateBranding,
    setTaskColor,
  };
}
