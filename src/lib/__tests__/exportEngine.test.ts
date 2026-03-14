import { describe, it, expect, vi } from "vitest";
import { exportToJSON, exportToCSV, exportToExcel } from "../exportEngine";
import type { GanttData } from "../../types";

// Mock browser APIs that export functions use
vi.stubGlobal("URL", {
  createObjectURL: vi.fn(() => "blob:mock"),
  revokeObjectURL: vi.fn(),
});

const mockData: GanttData = {
  data: [
    {
      id: 1,
      text: "Task 1",
      start_date: "2024-01-01",
      duration: 5,
      progress: 0.5,
      color: "#4361ee",
      textColor: "#ffffff",
      progressColor: "#3a0ca3",
      open: true,
    },
    {
      id: 2,
      text: "Task 2",
      start_date: "2024-01-10",
      duration: 3,
      progress: 0,
      color: "#7209b7",
      textColor: "#ffffff",
      progressColor: "#560bad",
      open: true,
    },
  ],
  links: [{ id: 1, source: 1, target: 2, type: "0" }],
};

describe("exportEngine", () => {
  describe("exportToJSON", () => {
    it("does not throw when exporting valid data", () => {
      // Mock anchor click/download
      const mockAnchor = { href: "", download: "", click: vi.fn() };
      vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);

      expect(() => exportToJSON(mockData, "test.json")).not.toThrow();
    });
  });

  describe("exportToCSV", () => {
    it("does not throw when exporting valid data", () => {
      const mockAnchor = { href: "", download: "", click: vi.fn() };
      vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);

      expect(() => exportToCSV(mockData, "test.csv")).not.toThrow();
    });
  });

  describe("exportToExcel", () => {
    it("does not throw when exporting valid data", () => {
      const mockAnchor = { href: "", download: "", click: vi.fn() };
      vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);

      expect(() => exportToExcel(mockData, "test.xlsx")).not.toThrow();
    });
  });
});
