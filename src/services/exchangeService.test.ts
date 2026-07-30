import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ExchangeRateError,
  fetchExchangeRate,
  getExchangeRateErrorCode,
} from "@/services/exchangeService";

describe("fetchExchangeRate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
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
      "https://api.exchangerate-api.com/v4/latest/BRL",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
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

    await expect(fetchExchangeRate("XXX", "USD")).rejects.toMatchObject({
      code: "currency_not_found",
    });
  });

  it("deve lançar erro quando a API limitar requisições", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toMatchObject({
      code: "rate_limit",
    });
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

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toMatchObject({
      code: "unsupported_currency",
    });
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

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toMatchObject({
      code: "invalid_rate",
    });
  });

  it("deve lançar erro quando a resposta JSON for inválida", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("invalid JSON");
        },
      })
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it("deve lançar erro de timeout quando a API demorar demais", async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn((_input, init) => {
        const { signal } = init as { signal: AbortSignal };

        return new Promise((_, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(new Error("aborted by timeout")),
            { once: true }
          );
        });
      })
    );

    const requestPromise = fetchExchangeRate("BRL", "USD", {
      timeoutInMs: 50,
    });
    const expectation = expect(requestPromise).rejects.toMatchObject({
      code: "timeout",
    });

    await vi.advanceTimersByTimeAsync(50);

    await expectation;
  });

  it("deve lançar erro de rede quando o fetch falhar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
    );

    await expect(fetchExchangeRate("BRL", "USD")).rejects.toMatchObject({
      code: "network_error",
    });
  });

  it("deve permitir recuperar o código de erro da integração", () => {
    const error = new ExchangeRateError("timeout", "Timed out");

    expect(getExchangeRateErrorCode(error)).toBe("timeout");
    expect(getExchangeRateErrorCode(new Error("generic"))).toBeNull();
  });
});
