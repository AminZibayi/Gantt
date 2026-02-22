import { useLocalStorage } from "./useLocalStorage";
import type { GanttData, GanttTask, GanttLink } from "../types";
import { defaultData } from "../config/defaultData";
import { useCallback } from "react";

export function useGanttData() {
  const [data, setData] = useLocalStorage<GanttData>("gantt-data", defaultData);

  const addTask = useCallback(
    (task: GanttTask) => {
      setData((prev) => ({
        ...prev,
        data: [...prev.data, task],
      }));
    },
    [setData]
  );

  const updateTask = useCallback(
    (id: number | string, updates: Partial<GanttTask>) => {
      setData((prev) => ({
        ...prev,
        data: prev.data.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [setData]
  );

  const deleteTask = useCallback(
    (id: number | string) => {
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((t) => t.id !== id),
        links: prev.links.filter((l) => l.source !== id && l.target !== id),
      }));
    },
    [setData]
  );

  const addLink = useCallback(
    (link: GanttLink) => {
      setData((prev) => ({
        ...prev,
        links: [...prev.links, link],
      }));
    },
    [setData]
  );

  const deleteLink = useCallback(
    (id: number | string) => {
      setData((prev) => ({
        ...prev,
        links: prev.links.filter((l) => l.id !== id),
      }));
    },
    [setData]
  );

  const importData = useCallback(
    (newData: GanttData) => {
      setData(newData);
    },
    [setData]
  );

  const clearData = useCallback(() => {
    setData({ data: [], links: [] });
  }, [setData]);

  const getNextId = useCallback(() => {
    const maxId = data.data.reduce((max, t) => {
      const numId = typeof t.id === "number" ? t.id : parseInt(t.id, 10);
      return isNaN(numId) ? max : Math.max(max, numId);
    }, 0);
    return maxId + 1;
  }, [data]);

  return {
    data,
    setData,
    addTask,
    updateTask,
    deleteTask,
    addLink,
    deleteLink,
    importData,
    clearData,
    getNextId,
  };
}
