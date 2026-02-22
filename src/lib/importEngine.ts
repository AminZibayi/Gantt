import { useCallback } from "react";
import type { GanttTask, ValidationError, ImportResult } from "../types";
import { getColorForIndex } from "../config/defaultData";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jalaali from "jalaali-js";

const REQUIRED_COLUMNS = ["text"];
const DATE_COLUMNS = ["start_date", "end_date"];
const NUMERIC_COLUMNS = ["duration", "progress", "id", "parent"];

const COLUMN_ALIASES: Record<string, string[]> = {
  id: ["id", "شناسه", "row", "ردیف", "#"],
  text: ["text", "name", "task", "title", "نام", "عنوان", "فعالیت", "task name", "نام فعالیت"],
  start_date: ["start_date", "start", "begin", "شروع", "تاریخ شروع", "start date", "begin date"],
  end_date: ["end_date", "end", "finish", "پایان", "تاریخ پایان", "end date", "finish date"],
  duration: ["duration", "days", "مدت", "روز", "مدت زمان"],
  progress: ["progress", "percent", "پیشرفت", "درصد", "درصد پیشرفت"],
  parent: ["parent", "parent_id", "والد", "شناسه والد", "parent id"],
  type: ["type", "نوع"],
  description: ["description", "note", "توضیحات", "یادداشت"],
  priority: ["priority", "اولویت"],
};

function normalizeColumnName(col: string): string {
  const normalized = col.trim().toLowerCase();
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === normalized)) {
      return key;
    }
  }
  return normalized;
}

function parseDate(value: unknown): string | null {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;

  // Try Jalali yyyy/mm/dd or yyyy-mm-dd
  const jalaliMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (jalaliMatch) {
    const year = parseInt(jalaliMatch[1], 10);
    const month = parseInt(jalaliMatch[2], 10);
    const day = parseInt(jalaliMatch[3], 10);
    if (year >= 1300 && year <= 1500) {
      const g = jalaali.toGregorian(year, month, day);
      return `${g.gy}-${String(g.gm).padStart(2, "0")}-${String(g.gd).padStart(2, "0")}`;
    }
  }

  // Try ISO
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;

  // Try dd/mm/yyyy or dd-mm-yyyy
  const slashMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (slashMatch) return `${slashMatch[3]}-${slashMatch[2].padStart(2, "0")}-${slashMatch[1].padStart(2, "0")}`;

  // Try Excel date serial
  if (!isNaN(Number(str))) {
    const num = Number(str);
    if (num > 40000 && num < 60000) {
      const date = new Date((num - 25569) * 86400 * 1000);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
  }

  // Try Date constructor
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return null;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export function parseFile(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete: (results) => {
          resolve(results.data as Record<string, unknown>[]);
        },
        error: (err: Error) => reject(err),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
          resolve(rows as Record<string, unknown>[]);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error(`Unsupported file format: ${ext}`));
    }
  });
}

export function validateAndTransform(rows: Record<string, unknown>[]): ImportResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!rows || rows.length === 0) {
    errors.push({ message: "emptyFile", severity: "error" });
    return { data: [], links: [], errors, warnings };
  }

  // Map column names
  const rawCols = Object.keys(rows[0]);
  const colMap: Record<string, string> = {};
  for (const col of rawCols) {
    colMap[col] = normalizeColumnName(col);
  }

  // Check required columns
  const mappedColNames = Object.values(colMap);
  for (const req of REQUIRED_COLUMNS) {
    if (!mappedColNames.includes(req)) {
      errors.push({
        message: "missingRequired",
        column: req,
        severity: "error",
      });
    }
  }

  // Check we have at least start_date or duration
  const hasStartDate = mappedColNames.includes("start_date");
  const hasDuration = mappedColNames.includes("duration");
  if (!hasStartDate) {
    warnings.push({
      message: "missingRequired",
      column: "start_date",
      severity: "warning",
    });
  }

  if (errors.length > 0) {
    return { data: [], links: [], errors, warnings };
  }

  const tasks: GanttTask[] = [];
  const seenIds = new Set<number | string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 for 1-indexed + header row

    // Remap row keys
    const mapped: Record<string, unknown> = {};
    for (const [orig, norm] of Object.entries(colMap)) {
      mapped[norm] = row[orig];
    }

    // ID
    let id: number | string = i + 1;
    if (mapped.id !== undefined && mapped.id !== "") {
      const parsedId = parseNumber(mapped.id);
      if (parsedId !== null) {
        id = parsedId;
      } else {
        id = String(mapped.id);
      }
    }

    if (seenIds.has(id)) {
      errors.push({
        row: rowNum,
        message: "duplicateId",
        severity: "error",
        value: String(id),
      });
      continue;
    }
    seenIds.add(id);

    // Text
    const text = String(mapped.text || `Task ${id}`).trim();

    // Start date
    let start_date = "";
    if (mapped.start_date) {
      const parsed = parseDate(mapped.start_date);
      if (parsed) {
        start_date = parsed;
      } else {
        errors.push({
          row: rowNum,
          column: "start_date",
          message: "invalidDate",
          severity: "error",
          value: String(mapped.start_date),
        });
        continue;
      }
    } else {
      start_date = new Date().toISOString().split("T")[0];
    }

    // Duration
    let duration: number | undefined;
    if (mapped.duration !== undefined && mapped.duration !== "") {
      const parsed = parseNumber(mapped.duration);
      if (parsed !== null && parsed >= 0) {
        duration = parsed;
      } else {
        warnings.push({
          row: rowNum,
          column: "duration",
          message: "invalidNumber",
          severity: "warning",
          value: String(mapped.duration),
        });
        duration = 1;
      }
    } else {
      duration = 1;
    }

    // End date
    let end_date: string | undefined;
    if (mapped.end_date) {
      const parsed = parseDate(mapped.end_date);
      if (parsed) {
        end_date = parsed;
      } else {
        warnings.push({
          row: rowNum,
          column: "end_date",
          message: "invalidDate",
          severity: "warning",
          value: String(mapped.end_date),
        });
      }
    }

    // Progress
    let progress = 0;
    if (mapped.progress !== undefined && mapped.progress !== "") {
      const parsed = parseNumber(mapped.progress);
      if (parsed !== null) {
        progress = parsed > 1 ? parsed / 100 : parsed;
      }
    }

    // Parent
    let parent: number | string | undefined;
    if (mapped.parent !== undefined && mapped.parent !== "" && mapped.parent !== "0") {
      const parsed = parseNumber(mapped.parent);
      parent = parsed !== null ? parsed : String(mapped.parent);
    }

    // Color
    const colorDef = getColorForIndex(i);

    const task: GanttTask = {
      id,
      text,
      start_date,
      duration,
      progress,
      parent,
      color: colorDef.color,
      textColor: colorDef.textColor,
      progressColor: colorDef.progressColor,
      open: true,
    };

    if (end_date) task.end_date = end_date;
    if (mapped.type) task.type = String(mapped.type);
    if (mapped.description) task.description = String(mapped.description);

    tasks.push(task);
  }

  // Validate parent references
  for (const task of tasks) {
    if (task.parent && !seenIds.has(task.parent)) {
      warnings.push({
        row: tasks.indexOf(task) + 2,
        message: "invalidParent",
        severity: "warning",
        value: String(task.parent),
      });
      task.parent = undefined;
    }
  }

  return { data: tasks, links: [], errors, warnings };
}

export function useFileImport() {
  const importFile = useCallback(async (file: File): Promise<ImportResult> => {
    try {
      const rows = await parseFile(file);
      return validateAndTransform(rows);
    } catch (err) {
      return {
        data: [],
        links: [],
        errors: [{ message: String(err), severity: "error" }],
        warnings: [],
      };
    }
  }, []);

  return { importFile };
}
