import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, MouseEvent } from "react";
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

// Limite de histórico máximo
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

// ✅ CORREÇÃO #1: Função para validar dados do localStorage
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

// ✅ CORREÇÃO #1: Função para validar favoritos
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

// ✅ CORREÇÃO #1: Função para carregar dados com segurança
const loadFromLocalStorage = <T,>(
  key: string,
  validator: (data: unknown) => data is T,
  defaultValue: T
): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);
    if (validator(parsed)) {
      return parsed;
    }
    console.warn(`Invalid data in localStorage for key: ${key}`);
    return defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export default function Home() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversionResult[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // ✅ CORREÇÃO #1: Load history and favorites from localStorage com validação
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

  // ✅ CORREÇÃO #7: Save history to localStorage com limite
  useEffect(() => {
    const limitedHistory = history.slice(0, MAX_HISTORY_LENGTH);
    localStorage.setItem("currency_history", JSON.stringify(limitedHistory));
  }, [history]);

  // Save favorites to localStorage com limite
  useEffect(() => {
    const limitedFavorites = favorites.slice(0, MAX_FAVORITES_LENGTH);
    localStorage.setItem("currency_favorites", JSON.stringify(limitedFavorites));
  }, [favorites]);

  // ✅ CORREÇÃO #5: Melhorar tratamento de erros
  const convertCurrency = useCallback(async () => {
    // ✅ CORREÇÃO #10: Validação melhorada de NaN
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, insira um valor numérico válido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL + fromCurrency);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Moeda não encontrada na API");
        } else if (response.status === 429) {
          throw new Error("Muitas requisições. Tente novamente em alguns segundos");
        } else {
          throw new Error(`Erro HTTP ${response.status}`);
        }
      }

      // ✅ CORREÇÃO #3: Try-catch para JSON.parse
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Resposta da API inválida");
      }

      // ✅ CORREÇÃO #6: Validação correta de taxa
      const rate = data.rates?.[toCurrency];
      if (rate === undefined || rate === null) {
        throw new Error(`Moeda ${toCurrency} não suportada`);
      }

      if (typeof rate !== "number" || rate <= 0) {
        throw new Error("Taxa de câmbio inválida");
      }

      const convertedAmount = numAmount * rate;
      const conversionData: ConversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: numAmount,
        result: convertedAmount,
        rate: rate,
        timestamp: new Date().toLocaleString("pt-BR"),
      };

      setResult(conversionData);

      // Add to history com limite
      setHistory((prev) => [conversionData, ...prev].slice(0, MAX_HISTORY_LENGTH));

      toast.success("Conversão realizada com sucesso!");
    } catch (error) {
      // ✅ CORREÇÃO #5: Mensagens de erro específicas
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
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
    // Verificar limite
    if (favorites.length >= MAX_FAVORITES_LENGTH) {
      toast.error(`Máximo de ${MAX_FAVORITES_LENGTH} favoritos atingido`);
      return;
    }

    const newFavorite: Favorite = {
      from: fromCurrency,
      to: toCurrency,
    };

    const exists = favorites.some(
      (fav) => fav.from === fromCurrency && fav.to === toCurrency
    );

    if (exists) {
      toast.info("Este par já está nos favoritos");
      return;
    }

    setFavorites((prev) => [...prev, newFavorite]);
    toast.success("Adicionado aos favoritos!");
  }, [fromCurrency, toCurrency, favorites.length]);

  // ✅ CORREÇÃO #8: Usar ID único ao invés de index
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
    toast.success("Favoritos limpo");
  }, []);

  const useFavorite = useCallback((fav: Favorite) => {
    setFromCurrency(fav.from);
    setToCurrency(fav.to);
    setResult(null);
  }, []);

  const getCurrencyFlag = useCallback((code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.flag || "💱";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      {/* Header */}
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

      {/* Main Converter Card */}
      <Card
        className="w-full max-w-2xl p-8 mb-8 animate-fade-in rounded-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 217, 255, 0.2)",
        }}
      >
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-200">Valor</label>
            <Input
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAmount(e.target.value);
                // ✅ CORREÇÃO #9: Não limpar resultado enquanto digita
              }}
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

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-200">De</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger
                  className="bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    borderColor: "rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <SelectValue>
                    <span className="text-2xl">{getCurrencyFlag(fromCurrency)}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-500/30">
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{curr.flag}</span>
                        <span>{curr.code}</span>
                        <span className="text-xs text-gray-400">({curr.name})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex items-end justify-center">
              <Button
                onClick={swapCurrencies}
                variant="outline"
                size="icon"
                className="rounded-full border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 h-12 w-12 transition-all duration-200"
              >
                <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-200">Para</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger
                  className="bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    borderColor: "rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <SelectValue>
                    <span className="text-2xl">{getCurrencyFlag(toCurrency)}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-500/30">
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{curr.flag}</span>
                        <span>{curr.code}</span>
                        <span className="text-xs text-gray-400">({curr.name})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert Button */}
          <Button
            onClick={convertCurrency}
            disabled={loading}
            className="w-full text-white font-bold py-6 text-lg rounded-xl transition-all duration-300 glow-cyan"
            style={{
              background: "linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)",
            }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #00E5FF 0%, #FF1A7F 100%)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)";
              e.currentTarget.style.transform = "translateY(0)";
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

          {/* Result Display */}
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

          {/* Add to Favorites Button */}
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

      {/* Favorites Section */}
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
              <button
                key={`${fav.from}-${fav.to}`}
                onClick={() => useFavorite(fav)}
                className="px-4 py-2 bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 rounded-full text-sm text-cyan-300 transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-lg">{getCurrencyFlag(fav.from)}</span>
                <span>→</span>
                <span className="text-lg">{getCurrencyFlag(fav.to)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(fav.from, fav.to);
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* History Section */}
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
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="p-3 bg-white/5 border border-cyan-500/20 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
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
                  <p className="text-xs text-indigo-400 whitespace-nowrap ml-4">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-indigo-300 text-sm">
        <p>💡 Taxas de câmbio atualizadas em tempo real</p>
        <p className="text-xs text-indigo-400 mt-2">
          © 2026 Aurora Currency Converter
        </p>
      </div>
    </div>
  );
}
