import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchExchangeRate } from "@/services/exchangeService";

describe("fetchExchangeRate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("deve retornar a taxa de câmbio quando a API responder com sucesso", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rates: {
          USD: 0.2,
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const rate = await fetchExchangeRate("BRL", "USD");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );
    expect(rate).toBe(0.2);
  });

  it("deve lançar erro quando a moeda base não for encontrada", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })
    );

    await expect(fetchExchangeRate("XXX", "USD")).rejects.toThrow(
      "Moeda não encontrada na API"
    );
  });

  it("deve lançar erro quando a API limitar requisições", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toThrow(
      "Muitas requisições. Tente novamente em alguns segundos"
    );
  });

  it("deve lançar erro quando a moeda de destino não existir na resposta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rates: {
            EUR: 0.18,
          },
        }),
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toThrow(
      "Moeda USD não suportada"
    );
  });

  it("deve lançar erro quando a taxa de câmbio for inválida", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rates: {
            USD: 0,
          },
        }),
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toThrow(
      "Taxa de câmbio inválida"
    );
  });

  it("deve lançar erro quando a resposta JSON for inválida", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("JSON inválido");
        },
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toThrow(
      "Resposta da API inválida"
    );
  });
});