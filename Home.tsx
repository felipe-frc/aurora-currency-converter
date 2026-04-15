import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
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

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

const MAX_HISTORY_LENGTH = 50;
const MAX_FAVORITES_LENGTH = 20;

const CURRENCIES = [
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "AUD", name: "Dólar Australiano", flag: "🇦🇺" },
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "CAD", name: "Dólar Canadense", flag: "🇨🇦" },
  { code: "CHF", name: "Franco Suíço", flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Chinês", flag: "🇨🇳" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "JPY", name: "Iene Japonês", flag: "🇯🇵" },
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸" },
];

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

interface Favorite {
  from: string;
  to: string;
}

const validateConversionData = (data: unknown): data is ConversionResult[] => {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
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
      typeof item === "object" &&
      item !== null &&
      typeof item.from === "string" &&
      typeof item.to === "string"
  );
};

const loadFromLocalStorage = <T,>(
  key: string,
  validator: (data: unknown) => data is T,
  defaultValue: T
): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);
    if (validator(parsed)) return parsed;

    console.warn(`Invalid data in localStorage for key: ${key}`);
    return defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
};

export default function Home() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversionResult[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const savedHistory = loadFromLocalStorage(
      "currency_history",
      validateConversionData,
      []
    );
    const savedFavorites = loadFromLocalStorage(
      "currency_favorites",
      validateFavoritesData,
      []
    );

    setHistory(savedHistory);
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "currency_history",
      JSON.stringify(history.slice(0, MAX_HISTORY_LENGTH))
    );
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      "currency_favorites",
      JSON.stringify(favorites.slice(0, MAX_FAVORITES_LENGTH))
    );
  }, [favorites]);

  const convertCurrency = useCallback(async () => {
    const numAmount = parseFloat(amount);

    if (Number.isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, insira um valor numérico válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL + fromCurrency);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Moeda não encontrada na API");
        }
        if (response.status === 429) {
          throw new Error("Muitas requisições. Tente novamente em alguns segundos");
        }
        throw new Error(`Erro HTTP ${response.status}`);
      }

      let data: { rates?: Record<string, number> };

      try {
        data = await response.json();
      } catch {
        throw new Error("Resposta da API inválida");
      }

      const rate = data.rates?.[toCurrency];

      if (rate === undefined || rate === null) {
        throw new Error(`Moeda ${toCurrency} não suportada`);
      }

      if (typeof rate !== "number" || rate <= 0) {
        throw new Error("Taxa de câmbio inválida");
      }

      const conversionData: ConversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: numAmount,
        result: numAmount * rate,
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
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

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

    const exists = favorites.some(
      (fav) => fav.from === fromCurrency && fav.to === toCurrency
    );

    if (exists) {
      toast.info("Este par já está nos favoritos");
      return;
    }

    const newFavorite: Favorite = {
      from: fromCurrency,
      to: toCurrency,
    };

    setFavorites((prev) => [...prev, newFavorite]);
    toast.success("Adicionado aos favoritos!");
  }, [favorites, fromCurrency, toCurrency]);

  const removeFavorite = useCallback((from: string, to: string) => {
    setFavorites((prev) => prev.filter((fav) => !(fav.from === from && fav.to === to)));
    toast.success("Removido dos favoritos");
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setResult(null);
    toast.success("Histórico limpo");
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    toast.success("Favoritos limpos");
  }, []);

  const useFavorite = useCallback((fav: Favorite) => {
    setFromCurrency(fav.from);
    setToCurrency(fav.to);
    setResult(null);
  }, []);

  const getCurrencyFlag = useCallback((code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.flag || "💱";
  }, []);

  const getCurrencyLabel = useCallback((code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.name || code;
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
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 217, 255, 0.2)",
        }}
      >
        <div className="space-y-6 overflow-visible">
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-200">Valor</label>
            <Input
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              placeholder="100.00"
              step="0.01"
              min="0"
              className="bg-white/10 border-cyan-500/30 text-white placeholder:text-white/50 text-lg font-semibold rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(0, 217, 255, 0.3)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end overflow-visible">
            <div className="space-y-2 relative z-20">
              <label className="text-sm font-medium text-indigo-200">De</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger
                  className="w-full bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    borderColor: "rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <SelectValue>
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{getCurrencyFlag(fromCurrency)}</span>
                      <span>{getCurrencyLabel(fromCurrency)}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  sideOffset={8}
                  align="start"
                  className="z-[9999] w-[min(360px,calc(100vw-2rem))] max-h-72 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-white backdrop-blur-xl"
                >
                  {CURRENCIES.map((curr) => (
                    <SelectItem
                      key={curr.code}
                      value={curr.code}
                      className="cursor-pointer rounded-lg py-3 focus:bg-cyan-500/15 focus:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{curr.flag}</span>

                        <span className="font-semibold">{curr.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-center md:pb-[2px]">
              <Button
                onClick={swapCurrencies}
                variant="outline"
                size="icon"
                className="rounded-full border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 h-12 w-12 transition-all duration-200"
              >
                <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
              </Button>
            </div>

            <div className="space-y-2 relative z-20">
              <label className="text-sm font-medium text-indigo-200">Para</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger
                  className="w-full bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    borderColor: "rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <SelectValue>
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{getCurrencyFlag(toCurrency)}</span>
                      <span>{getCurrencyLabel(toCurrency)}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  sideOffset={8}
                  align="start"
                  className="z-[9999] w-[min(360px,calc(100vw-2rem))] max-h-72 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-white backdrop-blur-xl"
                >
                  {CURRENCIES.map((curr) => (
                    <SelectItem
                      key={curr.code}
                      value={curr.code}
                      className="cursor-pointer rounded-lg py-3 focus:bg-cyan-500/15 focus:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{curr.flag}</span>

                        <span className="font-semibold">{curr.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={convertCurrency}
            disabled={loading}
            className="w-full text-white font-bold py-6 text-lg rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 glow-cyan"
            style={{
              background: "linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Convertendo...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Converter Moeda
              </span>
            )}
          </Button>

          {result && (
            <div
              className="border border-cyan-500/50 rounded-xl p-6 space-y-3 animate-fade-in"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(255, 0, 110, 0.15) 100%)",
              }}
            >
              <div className="text-center">
                <p className="text-sm text-indigo-200 mb-2">Resultado</p>
                <p className="text-3xl font-bold text-white">
                  {result.result.toFixed(2)}{" "}
                  <span className="text-cyan-400">{result.to}</span>
                </p>
              </div>
              <div className="border-t border-cyan-500/30 pt-3">
                <p className="text-sm text-indigo-300 text-center">
                  1 {result.from} = {result.rate.toFixed(4)} {result.to}
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={addToFavorites}
            variant="outline"
            className="w-full border-pink-500/50 hover:border-pink-400 hover:bg-pink-500/10 text-pink-300 transition-all duration-200"
          >
            <Star className="h-4 w-4 mr-2" />
            Salvar par como favorito
          </Button>
        </div>
      </Card>

      {favorites.length > 0 && (
        <Card
          className="w-full max-w-2xl p-6 mb-8 animate-fade-in rounded-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">
              Favoritos ({favorites.length}/{MAX_FAVORITES_LENGTH})
            </h2>
            <Button
              onClick={clearFavorites}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => (
              <div
                key={`${fav.from}-${fav.to}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 rounded-full text-sm text-cyan-300 transition-all duration-200 group"
              >
                <button
                  type="button"
                  onClick={() => useFavorite(fav)}
                  className="flex items-center gap-2"
                  title={`Usar ${fav.from} para ${fav.to}`}
                >
                  <span className="text-lg">{getCurrencyFlag(fav.from)}</span>
                  <span>→</span>
                  <span className="text-lg">{getCurrencyFlag(fav.to)}</span>
                  <span className="sr-only">
                    {getCurrencyLabel(fav.from)} para {getCurrencyLabel(fav.to)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeFavorite(fav.from, fav.to)}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-300 hover:text-red-200"
                  title="Remover favorito"
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
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">
              Histórico ({history.length}/{MAX_HISTORY_LENGTH})
            </h2>
            <Button
              onClick={clearHistory}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
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
                      <span className="text-lg">{getCurrencyFlag(item.from)}</span>
                      {item.amount.toFixed(2)} {item.from}
                      <span className="text-cyan-400">→</span>
                      <span className="text-lg">{getCurrencyFlag(item.to)}</span>
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