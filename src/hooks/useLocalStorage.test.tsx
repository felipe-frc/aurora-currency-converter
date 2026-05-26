import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type TestItem = {
  name: string;
};

const isTestItemArray = (data: unknown): data is TestItem[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        typeof item.name === "string"
    )
  );
};

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("deve retornar o valor inicial quando não houver dado salvo", () => {
    const { result } = renderHook(() =>
      useLocalStorage<TestItem[]>("test_key", [], isTestItemArray)
    );

    expect(result.current[0]).toEqual([]);
  });

  it("deve carregar dados válidos do localStorage", () => {
    localStorage.setItem(
      "test_key",
      JSON.stringify([{ name: "Aurora" }])
    );

    const { result } = renderHook(() =>
      useLocalStorage<TestItem[]>("test_key", [], isTestItemArray)
    );

    expect(result.current[0]).toEqual([{ name: "Aurora" }]);
  });

  it("deve retornar o valor inicial quando os dados salvos forem inválidos", () => {
    localStorage.setItem("test_key", JSON.stringify([{ wrong: "data" }]));

    const { result } = renderHook(() =>
      useLocalStorage<TestItem[]>("test_key", [], isTestItemArray)
    );

    expect(result.current[0]).toEqual([]);
  });

  it("deve retornar o valor inicial quando o JSON estiver corrompido", () => {
    localStorage.setItem("test_key", "{invalid-json");

    const { result } = renderHook(() =>
      useLocalStorage<TestItem[]>("test_key", [], isTestItemArray)
    );

    expect(result.current[0]).toEqual([]);
  });

  it("deve salvar alterações no localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage<TestItem[]>("test_key", [], isTestItemArray)
    );

    act(() => {
      result.current[1]([{ name: "Aurora" }]);
    });

    expect(JSON.parse(localStorage.getItem("test_key") ?? "[]")).toEqual([
      { name: "Aurora" },
    ]);
  });
});