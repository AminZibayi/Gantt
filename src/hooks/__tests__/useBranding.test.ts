import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBranding } from "../useBranding";

describe("useBranding", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default branding with 'Gantt' as company name", () => {
    const { result } = renderHook(() => useBranding());
    expect(result.current.branding.companyName).toBe("Gantt");
  });

  it("updates branding config", () => {
    const { result } = renderHook(() => useBranding());
    act(() => {
      result.current.updateBranding("companyName", "My Company");
    });
    expect(result.current.branding.companyName).toBe("My Company");
  });
});
