import { useLanguage } from "@/contexts/useLanguage";
import { getCurrencyLabel } from "@/data/currencies";
import type { ConversionResult } from "@/types/currency";
import { formatCurrency, formatExchangeRate } from "@/utils/formatCurrency";

type CurrencyResultProps = {
  result: ConversionResult;
};

export function CurrencyResult({ result }: CurrencyResultProps) {
  const { t } = useLanguage();

  return (
    <div className="mt-6 animate-fade-in rounded-2xl border border-sky-300/70 bg-white/75 p-6 text-center shadow-sm dark:border-cyan-400/30 dark:bg-cyan-500/10">
      <p className="text-lg font-medium text-slate-700 dark:text-indigo-200">
        {formatCurrency(result.amount, result.from)} {t("equalsTo")}
      </p>

      <p className="my-2 text-4xl font-bold text-slate-900 dark:text-white">
        {formatCurrency(result.result, result.to)}
      </p>

      <p className="text-sm font-medium text-sky-700 dark:text-indigo-300">
        {t("exchangeRate")}: 1 {getCurrencyLabel(result.from)} ={" "}
        {formatExchangeRate(result.rate)} {result.to}
      </p>
    </div>
  );
}