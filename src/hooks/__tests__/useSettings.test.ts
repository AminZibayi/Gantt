import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "../useSettings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default settings", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toBeDefined();
    expect(result.current.settings.language).toBeDefined();
    expect(result.current.settings.zoomLevel).toBeDefined();
  });

  it("updates a single setting", () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.updateSetting("zoomLevel", "day");
    });
    expect(result.current.settings.zoomLevel).toBe("day");
  });
});
