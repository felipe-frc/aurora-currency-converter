import { useCallback, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { CURRENCIES, getCurrency, getCurrencyLabel } from "@/data/currencies";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fetchExchangeRate } from "@/services/exchangeService";
import type { ConversionResult, Favorite } from "@/types/currency";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Star, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const TWEMOJI_CDN =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";

const MAX_HISTORY_LENGTH = 50;
const MAX_FAVORITES_LENGTH = 20;

const STORAGE_KEYS = {
  history: "currency_history",
  favorites: "currency_favorites",
} as const;

const GLASS_CARD_STYLE = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(0, 217, 255, 0.2)",
} satisfies CSSProperties;

const INPUT_GLASS_STYLE = {
  background: "rgba(255, 255, 255, 0.08)",
  borderColor: "rgba(0, 217, 255, 0.3)",
} satisfies CSSProperties;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const validateConversionData = (data: unknown): data is ConversionResult[] => {
  if (!Array.isArray(data)) return false;

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
  if (!Array.isArray(data)) return false;

  return data.every(
    (item) =>
      isObject(item) &&
      typeof item.from === "string" &&
      typeof item.to === "string"
  );
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
};

type FlagImageProps = {
  code: string;
  sizeClass?: string;
};

function FlagImage({ code, sizeClass = "w-8 h-8" }: FlagImageProps) {
  const currency = getCurrency(code);

  if (!currency) {
    return null;
  }

  return (
    <img
      src={`${TWEMOJI_CDN}/${currency.emojiCode}.svg`}
      alt={`Bandeira de ${currency.name}`}
      className={`${sizeClass} rounded-md object-cover drop-shadow-lg`}
      loading="lazy"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

export default function Home() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
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

  const convertCurrency = useCallback(async () => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Por favor, insira um valor numérico válido");
      return;
    }

    setLoading(true);

    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);

      const conversionData: ConversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: numericAmount,
        result: numericAmount * rate,
        rate,
        timestamp: new Date().toISOString(),
      };

      setResult(conversionData);
      setHistory((prev) => [conversionData, ...prev].slice(0, MAX_HISTORY_LENGTH));

      toast.success("Conversão realizada com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      toast.error(`Erro: ${errorMessage}`);
      console.error("Erro na conversão:", error);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, setHistory, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  }, [fromCurrency, toCurrency]);

  const addToFavorites = useCallback(() => {
    if (favorites.length >= MAX_FAVORITES_LENGTH) {
      toast.error(`Máximo de ${MAX_FAVORITES_LENGTH} favoritos atingido`);
      return;
    }

    const favoriteExists = favorites.some(
      (favorite) => favorite.from === fromCurrency && favorite.to === toCurrency
    );

    if (favoriteExists) {
      toast.info("Este par já está nos favoritos");
      return;
    }

    const newFavorite: Favorite = {
      from: fromCurrency,
      to: toCurrency,
    };

    setFavorites((prev) =>
      [...prev, newFavorite].slice(0, MAX_FAVORITES_LENGTH)
    );

    toast.success("Adicionado aos favoritos!");
  }, [favorites, fromCurrency, setFavorites, toCurrency]);

  const removeFavorite = useCallback(
    (from: string, to: string) => {
      setFavorites((prev) =>
        prev.filter((favorite) => !(favorite.from === from && favorite.to === to))
      );

      toast.success("Removido dos favoritos");
    },
    [setFavorites]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setResult(null);
    toast.success("Histórico limpo");
  }, [setHistory]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    toast.success("Favoritos limpos");
  }, [setFavorites]);

  const applyFavorite = useCallback((favorite: Favorite) => {
    setFromCurrency(favorite.from);
    setToCurrency(favorite.to);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-x-clip">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-4xl">💱</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#FF006E]">
            Aurora
          </h1>
        </div>

        <p className="text-lg text-indigo-200 font-light">
          Conversor de Moedas Premium
        </p>
      </div>

      <Card
        className="relative w-full max-w-2xl p-8 mb-8 animate-fade-in rounded-3xl overflow-visible"
        style={GLASS_CARD_STYLE}
      >
        <div className="space-y-6 overflow-visible">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-indigo-200"
            >
              Valor
            </label>

            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setAmount(event.target.value)
              }
              placeholder="100.00"
              step="0.01"
              min="0"
              className="bg-white/10 border-cyan-500/30 text-white placeholder:text-white/50 text-lg font-semibold rounded-xl"
              style={INPUT_GLASS_STYLE}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end overflow-visible">
            <div className="space-y-2 relative z-20">
              <label
                id="from-currency-label"
                className="text-sm font-medium text-indigo-200"
              >
                De
              </label>

              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger
                  aria-labelledby="from-currency-label"
                  className="w-full bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={INPUT_GLASS_STYLE}
                >
                  <SelectValue>
                    <span className="flex items-center gap-3">
                      <FlagImage code={fromCurrency} sizeClass="w-7 h-7" />
                      <span className="text-sm font-medium">{fromCurrency}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  sideOffset={8}
                  align="start"
                  className="z-[9999] w-[min(360px,calc(100vw-2rem))] max-h-72 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-white backdrop-blur-xl"
                >
                  {CURRENCIES.map((currency) => (
                    <SelectItem
                      key={currency.code}
                      value={currency.code}
                      className="cursor-pointer rounded-lg py-3 focus:bg-cyan-500/15 focus:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <FlagImage code={currency.code} sizeClass="w-6 h-6" />
                        <span className="font-semibold">{currency.code}</span>
                        <span className="text-xs text-gray-400">
                          ({currency.name})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={swapCurrencies}
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-full transition-all duration-200 mx-auto"
              aria-label="Inverter moedas"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-2 relative z-10">
              <label
                id="to-currency-label"
                className="text-sm font-medium text-indigo-200"
              >
                Para
              </label>

              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger
                  aria-labelledby="to-currency-label"
                  className="w-full bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={INPUT_GLASS_STYLE}
                >
                  <SelectValue>
                    <span className="flex items-center gap-3">
                      <FlagImage code={toCurrency} sizeClass="w-7 h-7" />
                      <span className="text-sm font-medium">{toCurrency}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  sideOffset={8}
                  align="start"
                  className="z-[9999] w-[min(360px,calc(100vw-2rem))] max-h-72 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-white backdrop-blur-xl"
                >
                  {CURRENCIES.map((currency) => (
                    <SelectItem
                      key={currency.code}
                      value={currency.code}
                      className="cursor-pointer rounded-lg py-3 focus:bg-cyan-500/15 focus:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <FlagImage code={currency.code} sizeClass="w-6 h-6" />
                        <span className="font-semibold">{currency.code}</span>
                        <span className="text-xs text-gray-400">
                          ({currency.name})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {result && (
            <div className="mt-6 text-center animate-fade-in bg-cyan-500/10 border border-cyan-400/30 rounded-2xl p-6">
              <p className="text-lg text-indigo-200">
                {result.amount.toFixed(2)} {getCurrencyLabel(result.from)} é igual a
              </p>

              <p className="text-4xl font-bold text-white my-2">
                {result.result.toFixed(2)} {getCurrencyLabel(result.to)}
              </p>

              <p className="text-sm text-indigo-300">
                Taxa de câmbio: 1 {result.from} = {result.rate.toFixed(4)}{" "}
                {result.to}
              </p>
            </div>
          )}

          <Button
            type="button"
            onClick={convertCurrency}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00D9FF] to-[#FF006E] text-white font-bold py-3 rounded-xl text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span className="ml-2">Convertendo...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Converter
              </div>
            )}
          </Button>

          <Button
            type="button"
            onClick={addToFavorites}
            variant="outline"
            className="w-full bg-transparent border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white rounded-xl transition-all duration-200"
          >
            <Star className="h-4 w-4 mr-2" />
            Salvar par como favorito
          </Button>
        </div>
      </Card>

      {favorites.length > 0 && (
        <Card
          className="w-full max-w-2xl p-6 mb-8 animate-fade-in rounded-3xl"
          style={GLASS_CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">
              Favoritos ({favorites.length}/{MAX_FAVORITES_LENGTH})
            </h2>

            <Button
              type="button"
              onClick={clearFavorites}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              aria-label="Limpar favoritos"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {favorites.map((favorite) => (
              <div
                key={`${favorite.from}-${favorite.to}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 rounded-full text-sm text-cyan-300 transition-all duration-200 group"
              >
                <button
                  type="button"
                  onClick={() => applyFavorite(favorite)}
                  className="flex items-center gap-2"
                  title={`Usar ${favorite.from} para ${favorite.to}`}
                >
                  <FlagImage code={favorite.from} sizeClass="w-5 h-5" />
                  <span className="text-xs font-semibold">{favorite.from}</span>
                  <span>→</span>
                  <FlagImage code={favorite.to} sizeClass="w-5 h-5" />
                  <span className="text-xs font-semibold">{favorite.to}</span>
                  <span className="sr-only">
                    {getCurrencyLabel(favorite.from)} para{" "}
                    {getCurrencyLabel(favorite.to)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeFavorite(favorite.from, favorite.to)}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-300 hover:text-red-200"
                  title="Remover favorito"
                  aria-label={`Remover favorito ${favorite.from} para ${favorite.to}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card
          className="w-full max-w-2xl p-6 animate-fade-in rounded-3xl"
          style={GLASS_CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">
              Histórico ({history.length}/{MAX_HISTORY_LENGTH})
            </h2>

            <Button
              type="button"
              onClick={clearHistory}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              aria-label="Limpar histórico"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="p-3 bg-white/5 border border-cyan-500/20 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2 flex-wrap">
                      <FlagImage code={item.from} sizeClass="w-5 h-5" />
                      {item.amount.toFixed(2)} {item.from}
                      <span className="text-cyan-400">→</span>
                      <FlagImage code={item.to} sizeClass="w-5 h-5" />
                      {item.result.toFixed(2)} {item.to}
                    </p>

                    <p className="text-xs text-indigo-300 mt-1">
                      Taxa: 1 {item.from} = {item.rate.toFixed(4)} {item.to}
                    </p>
                  </div>

                  <p className="text-xs text-indigo-400 whitespace-nowrap">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-12 text-center text-indigo-300 text-sm">
        <p>💡 Taxas de câmbio atualizadas em tempo real</p>
        <p className="text-xs text-indigo-400 mt-2">
          © 2026 Aurora Currency Converter
        </p>
      </div>
    </div>
  );
}