import { getCurrencyLabel } from "@/data/currencies";
import type { ConversionResult } from "@/types/currency";

type CurrencyResultProps = {
  result: ConversionResult;
};

export function CurrencyResult({ result }: CurrencyResultProps) {
  return (
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
  );
}