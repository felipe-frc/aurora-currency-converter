import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/contexts/useTheme";

describe("useTheme", () => {
  it("deve lançar erro quando usado fora do ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme deve ser usado dentro de ThemeProvider"
    );
  });

  it("deve expor o tema atual dentro do provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });
});
