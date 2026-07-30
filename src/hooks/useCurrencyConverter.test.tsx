import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

const { fetchExchangeRate, getExchangeRateErrorCode, toast } = vi.hoisted(() => {
  return {
    toast: {
      error: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    },
    fetchExchangeRate: vi.fn(),
    getExchangeRateErrorCode: vi.fn(
      (error: { code?: string } | unknown) => {
        return typeof error === "object" && error !== null && "code" in error
          ? (error as { code?: string }).code ?? null
          : null;
      }
    ),
  };
});

vi.mock("sonner", () => ({
  toast,
}));

vi.mock("@/services/exchangeService", () => ({
  fetchExchangeRate,
  getExchangeRateErrorCode,
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider defaultLanguage="pt-BR">{children}</LanguageProvider>;
}

describe("useCurrencyConverter", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchExchangeRate.mockReset();
    getExchangeRateErrorCode.mockClear();
    toast.error.mockReset();
    toast.info.mockReset();
    toast.success.mockReset();
  });

  it("deve converter com sucesso e salvar o histórico", async () => {
    fetchExchangeRate.mockResolvedValue(0.2);

    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    await act(async () => {
      await result.current.convertCurrency();
    });

    expect(fetchExchangeRate).toHaveBeenCalledWith(
      "BRL",
      "USD",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
    expect(result.current.result?.rate).toBe(0.2);
    expect(result.current.history).toHaveLength(1);
    expect(toast.success).toHaveBeenCalledWith("Conversão realizada com sucesso!");
  });

  it("deve converter sem chamar a API quando as moedas forem iguais", async () => {
    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    act(() => {
      result.current.setToCurrency("BRL");
    });

    await act(async () => {
      await result.current.convertCurrency();
    });

    expect(fetchExchangeRate).not.toHaveBeenCalled();
    expect(result.current.result?.rate).toBe(1);
    expect(result.current.history).toHaveLength(1);
  });

  it("deve gerenciar favoritos, remoção e limpeza", () => {
    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    act(() => {
      result.current.addToFavorites();
    });

    expect(result.current.favorites).toEqual([{ from: "BRL", to: "USD" }]);
    expect(toast.success).toHaveBeenCalledWith("Adicionado aos favoritos!");

    act(() => {
      result.current.addToFavorites();
    });

    expect(toast.info).toHaveBeenCalledWith("Este par já está nos favoritos");

    act(() => {
      result.current.removeFavorite("BRL", "USD");
    });

    expect(result.current.favorites).toEqual([]);

    act(() => {
      result.current.addToFavorites();
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toEqual([]);
  });

  it("deve limpar o histórico e cancelar resultado anterior", async () => {
    fetchExchangeRate.mockResolvedValue(0.2);

    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    await act(async () => {
      await result.current.convertCurrency();
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.result).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Histórico limpo");
  });

  it("deve exibir mensagem localizada quando a API falhar por timeout", async () => {
    fetchExchangeRate.mockRejectedValue({ code: "timeout" });

    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    await act(async () => {
      await result.current.convertCurrency();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Erro: A consulta de câmbio demorou demais para responder."
    );
  });

  it("deve validar valor inválido antes de converter", async () => {
    const { result } = renderHook(() => useCurrencyConverter(), { wrapper });

    act(() => {
      result.current.setAmount("0");
    });

    await act(async () => {
      await result.current.convertCurrency();
    });

    expect(fetchExchangeRate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Por favor, insira um valor numérico válido"
    );
  });
});
