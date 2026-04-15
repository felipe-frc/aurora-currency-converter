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

// CDN do Twemoji para emojis de alta definição
const TWEMOJI_CDN = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";

const MAX_HISTORY_LENGTH = 50;
const MAX_FAVORITES_LENGTH = 20;

// Mapeamento de moedas para emojis de bandeira (Unicode)
const CURRENCIES = [
  { code: "ARS", name: "Peso Argentino", emoji: "🇦🇷", emojiCode: "1f1e6-1f1f7" },
  { code: "AUD", name: "Dólar Australiano", emoji: "🇦🇺", emojiCode: "1f1e6-1f1fa" },
  { code: "BRL", name: "Real Brasileiro", emoji: "🇧🇷", emojiCode: "1f1e7-1f1f7" },
  { code: "CAD", name: "Dólar Canadense", emoji: "🇨🇦", emojiCode: "1f1e8-1f1e6" },
  { code: "CHF", name: "Franco Suíço", emoji: "🇨🇭", emojiCode: "1f1e8-1f1ed" },
  { code: "CNY", name: "Yuan Chinês", emoji: "🇨🇳", emojiCode: "1f1e8-1f1f3" },
  { code: "EUR", name: "Euro", emoji: "🇪🇺", emojiCode: "1f1ea-1f1fa" },
  { code: "GBP", name: "Libra Esterlina", emoji: "🇬🇧", emojiCode: "1f1ec-1f1e7" },
  { code: "JPY", name: "Iene Japonês", emoji: "🇯🇵", emojiCode: "1f1ef-1f1f5" },
  { code: "USD", name: "Dólar Americano", emoji: "🇺🇸", emojiCode: "1f1fa-1f1f8" },
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

  const getFlagImage = (code: string, size: string = "w-8 h-8") => {
    const currency = CURRENCIES.find((c) => c.code === code);
    if (!currency) return null;
    
    return (
      <img
        src={`${TWEMOJI_CDN}/${currency.emojiCode}.svg`}
        alt={`Bandeira de ${currency.name}`}
        className={`${size} rounded-md object-cover drop-shadow-lg`}
        loading="lazy"
        style={{ imageRendering: "crisp-edges" }}
      />
    );
  };

  const getCurrencyLabel = useCallback((code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.name || code;
  }, []);

  const getCurrencyCode = useCallback((code: string) => {
    return code;
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
                      {getFlagImage(fromCurrency, "w-7 h-7")}
                      <span className="text-sm font-medium">{getCurrencyCode(fromCurrency)}</span>
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
                        {getFlagImage(curr.code, "w-6 h-6")}
                        <span className="font-semibold">{curr.code}</span>
                        <span className="text-xs text-gray-400">({curr.name})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={swapCurrencies}
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-full transition-all duration-200 mx-auto"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-2 relative z-10">
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
                      {getFlagImage(toCurrency, "w-7 h-7")}
                      <span className="text-sm font-medium">{getCurrencyCode(toCurrency)}</span>
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
                        {getFlagImage(curr.code, "w-6 h-6")}
                        <span className="font-semibold">{curr.code}</span>
                        <span className="text-xs text-gray-400">({curr.name})</span>
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
                Taxa de câmbio: 1 {result.from} = {result.rate.toFixed(4)} {result.to}
              </p>
            </div>
          )}

          <Button
            onClick={convertCurrency}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00D9FF] to-[#FF006E] text-white font-bold py-3 rounded-xl text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  {getFlagImage(fav.from, "w-5 h-5")}
                  <span className="text-xs font-semibold">{fav.from}</span>
                  <span>→</span>
                  {getFlagImage(fav.to, "w-5 h-5")}
                  <span className="text-xs font-semibold">{fav.to}</span>
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
                      {getFlagImage(item.from, "w-5 h-5")}
                      {item.amount.toFixed(2)} {item.from}
                      <span className="text-cyan-400">→</span>
                      {getFlagImage(item.to, "w-5 h-5")}
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
