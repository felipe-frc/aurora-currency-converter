import type { ChangeEvent, CSSProperties } from "react";
import { CurrencyResult } from "@/components/currency/CurrencyResult";
import { CurrencySelect } from "@/components/currency/CurrencySelect";
import { FavoritesList } from "@/components/currency/FavoritesList";
import { HistoryList } from "@/components/currency/HistoryList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/useLanguage";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { ArrowRightLeft, Star, TrendingUp } from "lucide-react";

const GLASS_CARD_STYLE = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "0 20px 60px rgba(15, 35, 63, 0.12)",
} satisfies CSSProperties;

const INPUT_GLASS_STYLE = {
  background: "var(--input)",
  borderColor: "var(--border)",
} satisfies CSSProperties;

export default function Home() {
  const { t } = useLanguage();
  const {
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
    maxHistoryLength,
    maxFavoritesLength,
    convertCurrency,
    swapCurrencies,
    addToFavorites,
    removeFavorite,
    clearHistory,
    clearFavorites,
    applyFavorite,
  } = useCurrencyConverter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-clip px-4 py-8">
      <div className="mb-12 animate-fade-in text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="text-4xl">💱</div>

          <h1 className="bg-gradient-to-r from-sky-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-5xl font-bold text-transparent dark:from-[#00D9FF] dark:to-[#FF006E]">
            Aurora
          </h1>
        </div>

        <p className="text-lg font-medium text-slate-700 dark:text-indigo-200">
          {t("appSubtitle")}
        </p>
      </div>

      <Card
        className="relative mb-8 w-full max-w-2xl overflow-visible rounded-3xl p-8 animate-fade-in"
        style={GLASS_CARD_STYLE}
      >
        <div className="space-y-6 overflow-visible">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-semibold text-slate-700 dark:text-indigo-200"
            >
              {t("amount")}
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
              className="rounded-xl border border-sky-400/50 bg-white/85 text-lg font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:border-sky-500 dark:border-cyan-500/30 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
              style={INPUT_GLASS_STYLE}
            />
          </div>

          <div className="grid grid-cols-1 items-end gap-4 overflow-visible md:grid-cols-[1fr_auto_1fr]">
            <CurrencySelect
              id="from-currency"
              label={t("from")}
              value={fromCurrency}
              onValueChange={setFromCurrency}
              className="relative z-20"
              triggerStyle={INPUT_GLASS_STYLE}
            />

            <Button
              type="button"
              onClick={swapCurrencies}
              variant="ghost"
              size="icon"
              className="mx-auto rounded-full border border-sky-400/60 bg-white/80 text-sky-700 shadow-sm transition-all duration-200 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800 dark:border-cyan-500/30 dark:bg-white/10 dark:text-cyan-300 dark:hover:border-cyan-400 dark:hover:bg-cyan-500/20 dark:hover:text-white"
              aria-label={t("swapCurrencies")}
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <CurrencySelect
              id="to-currency"
              label={t("to")}
              value={toCurrency}
              onValueChange={setToCurrency}
              className="relative z-10"
              triggerStyle={INPUT_GLASS_STYLE}
            />
          </div>

          {result && <CurrencyResult result={result} />}

          <Button
            type="button"
            onClick={convertCurrency}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-fuchsia-500 py-3 text-lg font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 dark:from-[#00D9FF] dark:to-[#FF006E]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                <span className="ml-2">{t("converting")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                {t("convert")}
              </div>
            )}
          </Button>

          <Button
            type="button"
            onClick={addToFavorites}
            variant="outline"
            className="w-full rounded-xl border border-sky-400/60 bg-white/70 text-sky-700 shadow-sm transition-all duration-200 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800 dark:border-cyan-500/30 dark:bg-transparent dark:text-cyan-300 dark:hover:bg-cyan-500/20 dark:hover:text-white"
          >
            <Star className="mr-2 h-4 w-4" />
            {t("saveFavorite")}
          </Button>
        </div>
      </Card>

      <FavoritesList
        favorites={favorites}
        maxFavoritesLength={maxFavoritesLength}
        cardStyle={GLASS_CARD_STYLE}
        onApplyFavorite={applyFavorite}
        onRemoveFavorite={removeFavorite}
        onClearFavorites={clearFavorites}
      />

      <HistoryList
        history={history}
        maxHistoryLength={maxHistoryLength}
        cardStyle={GLASS_CARD_STYLE}
        onClearHistory={clearHistory}
      />

      <div className="mt-12 text-center text-sm font-medium text-slate-600 dark:text-indigo-300">
        <p>{t("exchangeRatesUpdated")}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-indigo-400">
          © 2026 Aurora Currency Converter
        </p>
      </div>
    </div>
  );
}
