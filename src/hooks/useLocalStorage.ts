import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const prefixedKey = `gantt-app-${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, storedValue]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(prefixedKey);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, initialValue]);

  return [storedValue, setValue, removeValue];
}
