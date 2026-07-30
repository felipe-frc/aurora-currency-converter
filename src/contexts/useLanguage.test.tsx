import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/useLanguage";

describe("useLanguage", () => {
  it("deve lançar erro quando usado fora do LanguageProvider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage deve ser usado dentro de LanguageProvider"
    );
  });

  it("deve expor o idioma atual dentro do provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider defaultLanguage="en-US">{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe("en-US");
  });
});
