import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  fetchExchangeRate,
  getExchangeRateErrorCode,
} from "@/services/exchangeService";
import type { ConversionResult, Favorite } from "@/types/currency";

const MAX_HISTORY_LENGTH = 50;
const MAX_FAVORITES_LENGTH = 20;

const STORAGE_KEYS = {
  history: "currency_history",
  favorites: "currency_favorites",
} as const;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const validateConversionData = (data: unknown): data is ConversionResult[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      isObject(item) &&
      typeof item.from === "string" &&
      typeof item.to === "string" &&
      typeof item.amount === "number" &&
      typeof item.result === "number" &&
      typeof item.rate === "number" &&
      typeof item.timestamp === "string"
  );
};

const validateFavoritesData = (data: unknown): data is Favorite[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      isObject(item) &&
      typeof item.from === "string" &&
      typeof item.to === "string"
  );
};

const createConversionResult = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rate: number
): ConversionResult => {
  return {
    from: fromCurrency,
    to: toCurrency,
    amount,
    result: amount * rate,
    rate,
    timestamp: new Date().toISOString(),
  };
};

export function useCurrencyConverter() {
  const { t } = useLanguage();
  const activeControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useLocalStorage<ConversionResult[]>(
    STORAGE_KEYS.history,
    [],
    validateConversionData
  );

  const [favorites, setFavorites] = useLocalStorage<Favorite[]>(
    STORAGE_KEYS.favorites,
    [],
    validateFavoritesData
  );

  const abortActiveRequest = useCallback(() => {
    requestIdRef.current += 1;
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      abortActiveRequest();
    };
  }, [abortActiveRequest]);

  const storeConversion = useCallback(
    (conversionData: ConversionResult) => {
      setResult(conversionData);
      setHistory((previousHistory) =>
        [conversionData, ...previousHistory].slice(0, MAX_HISTORY_LENGTH)
      );
    },
    [setHistory]
  );

  const getExchangeErrorMessage = useCallback(
    (error: unknown) => {
      const errorCode = getExchangeRateErrorCode(error);

      switch (errorCode) {
        case "currency_not_found":
          return t("baseCurrencyNotFound");
        case "rate_limit":
          return t("rateLimitExceeded");
        case "invalid_response":
          return t("invalidApiResponse");
        case "unsupported_currency":
          return t("unsupportedCurrency");
        case "invalid_rate":
          return t("invalidExchangeRate");
        case "timeout":
          return t("requestTimeout");
        case "network_error":
          return t("networkError");
        case "unexpected_http_status":
          return t("exchangeServiceUnavailable");
        default:
          return t("unknownError");
      }
    },
    [t]
  );

  const convertCurrency = useCallback(async () => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error(t("invalidAmount"));
      return;
    }

    if (fromCurrency === toCurrency) {
      abortActiveRequest();
      const conversionData = createConversionResult(
        numericAmount,
        fromCurrency,
        toCurrency,
        1
      );

      storeConversion(conversionData);
      toast.success(t("conversionSuccess"));
      return;
    }

    abortActiveRequest();

    const requestId = requestIdRef.current;
    const controller = new AbortController();

    activeControllerRef.current = controller;
    setLoading(true);

    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency, {
        signal: controller.signal,
      });

      if (requestIdRef.current !== requestId) {
        return;
      }

      const conversionData = createConversionResult(
        numericAmount,
        fromCurrency,
        toCurrency,
        rate
      );

      storeConversion(conversionData);
      toast.success(t("conversionSuccess"));
    } catch (error) {
      if (getExchangeRateErrorCode(error) === "aborted") {
        return;
      }

      toast.error(`${t("errorPrefix")}: ${getExchangeErrorMessage(error)}`);
      console.error("Currency conversion failed:", error);
    } finally {
      if (requestIdRef.current === requestId) {
        activeControllerRef.current = null;
        setLoading(false);
      }
    }
  }, [
    abortActiveRequest,
    amount,
    fromCurrency,
    getExchangeErrorMessage,
    storeConversion,
    t,
    toCurrency,
  ]);

  const swapCurrencies = useCallback(() => {
    abortActiveRequest();
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  }, [abortActiveRequest, fromCurrency, toCurrency]);

  const addToFavorites = useCallback(() => {
    if (favorites.length >= MAX_FAVORITES_LENGTH) {
      toast.error(`${t("favoriteLimit")}: ${MAX_FAVORITES_LENGTH}`);
      return;
    }

    const favoriteExists = favorites.some(
      (favorite) => favorite.from === fromCurrency && favorite.to === toCurrency
    );

    if (favoriteExists) {
      toast.info(t("favoriteAlreadyExists"));
      return;
    }

    const newFavorite: Favorite = {
      from: fromCurrency,
      to: toCurrency,
    };

    setFavorites((previousFavorites) =>
      [...previousFavorites, newFavorite].slice(0, MAX_FAVORITES_LENGTH)
    );

    toast.success(t("favoriteAdded"));
  }, [favorites, fromCurrency, setFavorites, t, toCurrency]);

  const removeFavorite = useCallback(
    (from: string, to: string) => {
      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (favorite) => !(favorite.from === from && favorite.to === to)
        )
      );

      toast.success(t("favoriteRemoved"));
    },
    [setFavorites, t]
  );

  const clearHistory = useCallback(() => {
    abortActiveRequest();
    setHistory([]);
    setResult(null);
    toast.success(t("historyCleared"));
  }, [abortActiveRequest, setHistory, t]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    toast.success(t("favoritesCleared"));
  }, [setFavorites, t]);

  const applyFavorite = useCallback(
    (favorite: Favorite) => {
      abortActiveRequest();
      setFromCurrency(favorite.from);
      setToCurrency(favorite.to);
      setResult(null);
    },
    [abortActiveRequest]
  );

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    result,
    loading,
    history,
    favorites,
    maxHistoryLength: MAX_HISTORY_LENGTH,
    maxFavoritesLength: MAX_FAVORITES_LENGTH,
    convertCurrency,
    swapCurrencies,
    addToFavorites,
    removeFavorite,
    clearHistory,
    clearFavorites,
    applyFavorite,
  };
}
