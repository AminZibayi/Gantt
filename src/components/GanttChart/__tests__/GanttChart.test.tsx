import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock the dhtmlxgantt module
vi.mock("@gantt/dist/dhtmlxgantt.es.js", () => ({
  default: {
    config: {},
    templates: {},
    i18n: { setLocale: vi.fn() },
    date: { date_to_str: () => () => "" },
    plugins: vi.fn(),
    init: vi.fn(),
    parse: vi.fn(),
    clearAll: vi.fn(),
    serialize: vi.fn(() => ({ data: [], links: [] })),
    attachEvent: vi.fn(),
    addMarker: vi.fn(),
    render: vi.fn(),
    showDate: vi.fn(),
  },
}));

// Must import after mock
import GanttChart from "../GanttChart";

describe("GanttChart", () => {
  it("renders without crashing", () => {
    const mockData = { data: [], links: [] };
    const mockSettings = {
      language: "en" as const,
      calendar: "gregorian" as const,
      theme: "material" as const,
      zoomLevel: "month" as const,
      showProgress: true,
      showLinks: true,
      showToday: true,
      showGrid: true,
      colorScheme: "dark" as const,
    };

    const { container } = render(<GanttChart data={mockData} settings={mockSettings} onDataChange={vi.fn()} />);

    expect(container.querySelector("#gantt-area")).toBeTruthy();
    expect(container.querySelector(".gantt-container")).toBeTruthy();
  });
});
