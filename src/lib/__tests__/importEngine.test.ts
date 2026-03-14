import { describe, it, expect } from "vitest";
import { validateAndTransform } from "../importEngine";

describe("importEngine", () => {
  describe("validateAndTransform", () => {
    it("returns errors when required 'text' column is missing", () => {
      const rows = [{ duration: "3", start_date: "2024-01-01" }];
      const result = validateAndTransform(rows);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toBe("missingRequired");
    });

    it("parses valid CSV-like rows with text and start_date", () => {
      const rows = [
        { text: "Task 1", start_date: "2024-01-01", duration: "5" },
        { text: "Task 2", start_date: "2024-02-15", duration: "3" },
      ];
      const result = validateAndTransform(rows);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].text).toBe("Task 1");
      expect(result.data[0].start_date).toBe("2024-01-01");
      expect(result.data[0].duration).toBe(5);
    });

    it("auto-detects Jalali dates and converts to Gregorian", () => {
      const rows = [{ text: "فعالیت ۱", start_date: "1403/01/15", duration: "3" }];
      const result = validateAndTransform(rows);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
      // 1403/01/15 Jalali = 2024-04-03 Gregorian
      expect(result.data[0].start_date).toBe("2024-04-03");
    });

    it("resolves bilingual column aliases", () => {
      const rows = [{ "نام فعالیت": "تسک اول", شروع: "1403/06/01", مدت: "7" }];
      const result = validateAndTransform(rows);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].text).toBe("تسک اول");
      expect(result.data[0].duration).toBe(7);
    });

    it("returns warnings for missing start_date column", () => {
      const rows = [{ text: "Task with no date" }];
      const result = validateAndTransform(rows);
      // Should have a warning for missing start_date but still produce data
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("flags invalid date values as errors", () => {
      const rows = [{ text: "Bad Date Task", start_date: "not-a-date", duration: "3" }];
      const result = validateAndTransform(rows);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.message === "invalidDate")).toBe(true);
    });

    it("handles empty rows array gracefully", () => {
      const result = validateAndTransform([]);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toBe("emptyFile");
    });

    it("assigns progress as a decimal between 0 and 1", () => {
      const rows = [{ text: "Task With Progress", start_date: "2024-01-01", duration: "5", progress: "50" }];
      const result = validateAndTransform(rows);
      expect(result.errors).toHaveLength(0);
      expect(result.data[0].progress).toBe(0.5);
    });

    it("handles duplicate IDs", () => {
      const rows = [
        { id: "1", text: "Task A", start_date: "2024-01-01", duration: "3" },
        { id: "1", text: "Task B", start_date: "2024-01-05", duration: "2" },
      ];
      const result = validateAndTransform(rows);
      expect(result.errors.some((e) => e.message === "duplicateId")).toBe(true);
    });
  });
});
