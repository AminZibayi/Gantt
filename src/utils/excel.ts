import * as XLSX from 'xlsx';
import { z } from 'zod';
import { Task, Link } from '../store';

// Zod schema for Task
const TaskSchema = z.object({
  id: z.union([z.string(), z.number()]),
  text: z.string().min(1, "Task name is required"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD").optional(),
  duration: z.number().nonnegative().optional(),
  parent: z.union([z.string(), z.number()]).optional(),
  progress: z.number().min(0).max(1).optional(),
});

// Zod schema for Link
const LinkSchema = z.object({
  id: z.union([z.string(), z.number()]),
  source: z.union([z.string(), z.number()]),
  target: z.union([z.string(), z.number()]),
  type: z.string(),
});

export interface ImportResult {
  tasks: Task[];
  links: Link[];
  errors: string[];
}

export const parseExcel = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assume first sheet is Tasks, second is Links (optional)
        const taskSheetName = workbook.SheetNames[0];
        const linkSheetName = workbook.SheetNames[1]; // Optional

        const taskRows = XLSX.utils.sheet_to_json(workbook.Sheets[taskSheetName]);
        const linkRows = linkSheetName ? XLSX.utils.sheet_to_json(workbook.Sheets[linkSheetName]) : [];

        const tasks: Task[] = [];
        const links: Link[] = [];
        const errors: string[] = [];

        // Validate Tasks
        taskRows.forEach((row: any, index) => {
          const result = TaskSchema.safeParse(row);
          if (result.success) {
            tasks.push(result.data as Task);
          } else {
            errors.push(`Row ${index + 2} in Tasks: ${(result.error as any).errors.map((e: any) => e.message).join(', ')}`);
          }
        });

        // Validate Links
        linkRows.forEach((row: any, index) => {
          const result = LinkSchema.safeParse(row);
          if (result.success) {
            links.push(result.data as Link);
          } else {
            errors.push(`Row ${index + 2} in Links: ${(result.error as any).errors.map((e: any) => e.message).join(', ')}`);
          }
        });

        resolve({ tasks, links, errors });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
