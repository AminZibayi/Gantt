import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads stored value from localStorage", () => {
    localStorage.setItem("gantt-app-test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("updates value via setValue", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
  });

  it("removes value from localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "value"));
    act(() => {
      result.current[2](); // removeValue
    });
    expect(result.current[0]).toBe("value"); // resets to initial
    expect(localStorage.getItem("gantt-app-test-key")).toBeNull();
  });

  it("handles complex objects", () => {
    const obj = { name: "test", count: 42 };
    const { result } = renderHook(() => useLocalStorage("test-obj", obj));
    expect(result.current[0]).toEqual(obj);

    const updated = { name: "updated", count: 100 };
    act(() => {
      result.current[1](updated);
    });
    expect(result.current[0]).toEqual(updated);
  });
});
