'use client';
import { useState, useEffect, useCallback } from 'react';
import { GanttData, GanttTask, GanttLink } from '@/types';
import { saveGanttData, loadGanttData } from '@/utils/storageUtils';
import { DEFAULT_TASKS } from '@/constants/defaults';

export function useGanttData() {
  const [ganttData, setGanttData] = useState<GanttData>(DEFAULT_TASKS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadGanttData();
    setGanttData(stored);
    setIsLoaded(true);
  }, []);

  const updateData = useCallback((data: GanttData) => {
    setGanttData(data);
    saveGanttData(data);
  }, []);

  const addTask = useCallback((task: Omit<GanttTask, 'id'>) => {
    setGanttData((prev) => {
      const maxId = prev.data.reduce(
        (max, t) => Math.max(max, Number(t.id) || 0),
        0
      );
      const newTask: GanttTask = { ...task, id: maxId + 1 };
      const newData = { ...prev, data: [...prev.data, newTask] };
      saveGanttData(newData);
      return newData;
    });
  }, []);

  const updateTask = useCallback(
    (id: string | number, updates: Partial<GanttTask>) => {
      setGanttData((prev) => {
        const newData = {
          ...prev,
          data: prev.data.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        };
        saveGanttData(newData);
        return newData;
      });
    },
    []
  );

  const deleteTask = useCallback((id: string | number) => {
    setGanttData((prev) => {
      const newData = {
        ...prev,
        data: prev.data.filter((t) => t.id !== id),
        links: prev.links.filter((l) => l.source !== id && l.target !== id),
      };
      saveGanttData(newData);
      return newData;
    });
  }, []);

  const addLink = useCallback((link: Omit<GanttLink, 'id'>) => {
    setGanttData((prev) => {
      const maxId = prev.links.reduce(
        (max, l) => Math.max(max, Number(l.id) || 0),
        0
      );
      const newLink: GanttLink = { ...link, id: maxId + 1 };
      const newData = { ...prev, links: [...prev.links, newLink] };
      saveGanttData(newData);
      return newData;
    });
  }, []);

  const deleteLink = useCallback((id: string | number) => {
    setGanttData((prev) => {
      const newData = {
        ...prev,
        links: prev.links.filter((l) => l.id !== id),
      };
      saveGanttData(newData);
      return newData;
    });
  }, []);

  const importData = useCallback((data: GanttData) => {
    saveGanttData(data);
    setGanttData(data);
  }, []);

  return {
    ganttData,
    isLoaded,
    updateData,
    addTask,
    updateTask,
    deleteTask,
    addLink,
    deleteLink,
    importData,
  };
}
