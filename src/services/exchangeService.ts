const DEFAULT_API_URL = "https://api.exchangerate-api.com/v4/latest";
const DEFAULT_TIMEOUT_IN_MS = 10_000;
const TIMEOUT_REASON = "exchange-request-timeout";

const env = import.meta as ImportMeta & {
  env?: {
    VITE_EXCHANGE_API_URL?: string;
  };
};

const API_URL = (env.env?.VITE_EXCHANGE_API_URL || DEFAULT_API_URL).replace(
  /\/$/,
  ""
);

type ExchangeRateApiResponse = {
  rates?: Record<string, number>;
};

export type ExchangeRateErrorCode =
  | "aborted"
  | "currency_not_found"
  | "invalid_rate"
  | "invalid_response"
  | "network_error"
  | "rate_limit"
  | "timeout"
  | "unexpected_http_status"
  | "unsupported_currency";

export class ExchangeRateError extends Error {
  constructor(
    readonly code: ExchangeRateErrorCode,
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "ExchangeRateError";
  }
}

type FetchExchangeRateOptions = {
  signal?: AbortSignal;
  timeoutInMs?: number;
};

const buildExchangeUrl = (currencyCode: string) => {
  return `${API_URL}/${currencyCode}`;
};

const createAbortError = (reason: unknown) => {
  return reason === TIMEOUT_REASON
    ? new ExchangeRateError("timeout", "Exchange rate request timed out")
    : new ExchangeRateError("aborted", "Exchange rate request was aborted");
};

export const getExchangeRateErrorCode = (error: unknown) => {
  return error instanceof ExchangeRateError ? error.code : null;
};

export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string,
  options: FetchExchangeRateOptions = {}
) => {
  const controller = new AbortController();
  const timeoutInMs = options.timeoutInMs ?? DEFAULT_TIMEOUT_IN_MS;

  const abortFromExternalSignal = () => {
    controller.abort(options.signal?.reason);
  };

  if (options.signal?.aborted) {
    throw createAbortError(options.signal.reason);
  }

  options.signal?.addEventListener("abort", abortFromExternalSignal, {
    once: true,
  });

  const timeoutId = window.setTimeout(() => {
    controller.abort(TIMEOUT_REASON);
  }, timeoutInMs);

  try {
    const response = await fetch(buildExchangeUrl(fromCurrency), {
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new ExchangeRateError(
          "currency_not_found",
          "Base currency was not found",
          response.status
        );
      }

      if (response.status === 429) {
        throw new ExchangeRateError(
          "rate_limit",
          "Exchange API rate limit exceeded",
          response.status
        );
      }

      throw new ExchangeRateError(
        "unexpected_http_status",
        `Unexpected HTTP status: ${response.status}`,
        response.status
      );
    }

    let data: ExchangeRateApiResponse;

    try {
      data = await response.json();
    } catch {
      throw new ExchangeRateError(
        "invalid_response",
        "Exchange API returned invalid JSON"
      );
    }

    const rate = data.rates?.[toCurrency];

    if (rate === undefined || rate === null) {
      throw new ExchangeRateError(
        "unsupported_currency",
        `Target currency ${toCurrency} is not supported`
      );
    }

    if (typeof rate !== "number" || rate <= 0) {
      throw new ExchangeRateError(
        "invalid_rate",
        "Exchange rate is invalid"
      );
    }

    return rate;
  } catch (error) {
    if (controller.signal.aborted) {
      throw createAbortError(controller.signal.reason);
    }

    if (error instanceof ExchangeRateError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ExchangeRateError(
        "network_error",
        "Exchange API could not be reached"
      );
    }

    throw new ExchangeRateError(
      "unexpected_http_status",
      "Unexpected exchange service error"
    );
  } finally {
    window.clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortFromExternalSignal);
  }
};
