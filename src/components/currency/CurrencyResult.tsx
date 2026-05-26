import { getCurrencyLabel } from "@/data/currencies";
import type { ConversionResult } from "@/types/currency";
import { formatCurrency, formatExchangeRate } from "@/utils/formatCurrency";

type CurrencyResultProps = {
  result: ConversionResult;
};

export function CurrencyResult({ result }: CurrencyResultProps) {
  return (
    <div className="mt-6 text-center animate-fade-in bg-cyan-500/10 border border-cyan-400/30 rounded-2xl p-6">
      <p className="text-lg text-indigo-200">
        {formatCurrency(result.amount, result.from)} é igual a
      </p>

      <p className="text-4xl font-bold text-white my-2">
        {formatCurrency(result.result, result.to)}
      </p>

      <p className="text-sm text-indigo-300">
        Taxa de câmbio: 1 {getCurrencyLabel(result.from)} ={" "}
        {formatExchangeRate(result.rate)} {result.to}
      </p>
    </div>
  );
}