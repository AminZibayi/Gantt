import { useLocalStorage } from "./useLocalStorage";
import type { GanttData, GanttTask, GanttLink } from "../types";
import { defaultData } from "../config/defaultData";
import { useCallback, useRef, useState, useEffect } from "react";
import { diffToCommands, type Command } from "../lib/commands";

interface HistoryEntry {
  command: Command;
  before: GanttData;
  after: GanttData;
}

function cloneGanttData(state: GanttData): GanttData {
  return {
    data: state.data.map((task) => {
      let startDateStr = "";
      if (task.start_date) {
        const sd = task.start_date as unknown;
        if (sd instanceof Date) {
          const year = sd.getFullYear();
          const month = String(sd.getMonth() + 1).padStart(2, "0");
          const day = String(sd.getDate()).padStart(2, "0");
          startDateStr = `${year}-${month}-${day}`;
        } else {
          const str = String(task.start_date);
          startDateStr = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
        }
      }

      let endDateStr: string | undefined;
      if (task.end_date) {
        const ed = task.end_date as unknown;
        if (ed instanceof Date) {
          const year = ed.getFullYear();
          const month = String(ed.getMonth() + 1).padStart(2, "0");
          const day = String(ed.getDate()).padStart(2, "0");
          endDateStr = `${year}-${month}-${day}`;
        } else {
          const str = String(task.end_date);
          endDateStr = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
        }
      }

      const clonedTask = { ...task };
      clonedTask.start_date = startDateStr;
      if (endDateStr) {
        clonedTask.end_date = endDateStr;
      }
      return clonedTask;
    }),
    links: state.links.map((link) => ({ ...link })),
  };
}
export function useGanttData() {
  const [data, setDataRaw, removeData] = useLocalStorage<GanttData>("gantt-data", defaultData);

  // ── History state ───────────────────────────────────────────────
  const historyRef = useRef<HistoryEntry[]>([]);
  const futureRef = useRef<HistoryEntry[]>([]);
  const [version, setVersion] = useState(0); // drives canUndo / canRedo reactivity
  const isUndoRedoRef = useRef(false);
  const MAX_HISTORY = 100;

  // Keep a ref to the latest data to avoid stale closures in getNextId/etc.
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Expose for debugging safely without any
  if (typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;
    win.ganttHistory = historyRef.current;
    win.ganttFuture = futureRef.current;
  }

  // ── Wrapped setData that records a diff command ─────────────────
  const setData = useCallback(
    (updater: GanttData | ((prev: GanttData) => GanttData)) => {
      const prev = dataRef.current;
      const next = typeof updater === "function" ? (updater as (p: GanttData) => GanttData)(prev) : updater;

      if (!isUndoRedoRef.current) {
        const command = diffToCommands(prev, next);
        if (command) {
          // Deep clone snapshots to prevent DHTMLX from corrupting them in-place!
          const beforeClone = cloneGanttData(prev);
          const nextClone = cloneGanttData(next);

          historyRef.current.push({ command, before: beforeClone, after: nextClone });
          if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
          futureRef.current = [];
          setVersion((v) => v + 1);
        }
      }
      dataRef.current = next;
      setDataRaw(next);
    },
    [setDataRaw]
  );

  // ── Undo / redo ────────────────────────────────────────────────
  const undo = useCallback(() => {
    const entry = historyRef.current.pop();
    if (!entry) return;
    futureRef.current.unshift(entry);
    isUndoRedoRef.current = true;
    
    // Restore the exact before snapshot
    setDataRaw(entry.before);
    
    isUndoRedoRef.current = false;
    setVersion((v) => v + 1);
  }, [setDataRaw]);

  const redo = useCallback(() => {
    const entry = futureRef.current.shift();
    if (!entry) return;
    historyRef.current.push(entry);
    isUndoRedoRef.current = true;
    
    // Restore the exact after snapshot
    setDataRaw(entry.after);
    
    isUndoRedoRef.current = false;
    setVersion((v) => v + 1);
  }, [setDataRaw]);

  // ── Convenience command-aware helpers ──────────────────────────
  const addTask = useCallback(
    (task: GanttTask) => {
      setData((prev: GanttData) => ({
        ...prev,
        data: [...prev.data, task],
      }));
    },
    [setData]
  );

  const updateTask = useCallback(
    (id: number | string, updates: Partial<GanttTask>) => {
      setData((prev: GanttData) => ({
        ...prev,
        data: prev.data.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [setData]
  );

  const deleteTask = useCallback(
    (id: number | string) => {
      setData((prev: GanttData) => ({
        ...prev,
        data: prev.data.filter((t) => t.id !== id),
        links: prev.links.filter((l) => l.source !== id && l.target !== id),
      }));
    },
    [setData]
  );

  const addLink = useCallback(
    (link: GanttLink) => {
      setData((prev: GanttData) => ({
        ...prev,
        links: [...prev.links, link],
      }));
    },
    [setData]
  );

  const deleteLink = useCallback(
    (id: number | string) => {
      setData((prev: GanttData) => ({
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
    const maxId = dataRef.current.data.reduce((max, t) => {
      const numId = typeof t.id === "number" ? t.id : parseInt(String(t.id), 10);
      return isNaN(numId) ? max : Math.max(max, numId);
    }, 0);
    return maxId + 1;
  }, []);

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
    undo,
    redo,
    canUndo: historyRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    removeData,
  };
}
