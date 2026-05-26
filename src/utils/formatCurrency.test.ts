import { describe, expect, it } from "vitest";
import { formatCurrency, formatExchangeRate } from "@/utils/formatCurrency";

const normalizeCurrencyText = (value: string) => {
  return value.replace(/\s/g, " ").trim();
};

describe("formatCurrency", () => {
  it("deve formatar valores em Real Brasileiro", () => {
    expect(normalizeCurrencyText(formatCurrency(100, "BRL"))).toBe("R$ 100,00");
  });

  it("deve formatar valores em Dólar Americano", () => {
    expect(normalizeCurrencyText(formatCurrency(20, "USD"))).toBe("US$ 20,00");
  });

  it("deve retornar fallback quando o código da moeda for inválido", () => {
    expect(formatCurrency(100, "INVALID")).toBe("100.00 INVALID");
  });
});

describe("formatExchangeRate", () => {
  it("deve formatar taxa de câmbio com quatro casas decimais", () => {
    expect(formatExchangeRate(0.2)).toBe("0,2000");
  });

  it("deve arredondar taxa de câmbio corretamente", () => {
    expect(formatExchangeRate(0.123456)).toBe("0,1235");
  });
});