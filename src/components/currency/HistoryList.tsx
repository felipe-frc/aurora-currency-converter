import { FlagImage } from "@/components/currency/FlagImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ConversionResult } from "@/types/currency";
import { formatCurrency, formatExchangeRate } from "@/utils/formatCurrency";
import { Trash2 } from "lucide-react";
import type { CSSProperties } from "react";

type HistoryListProps = {
  history: ConversionResult[];
  maxHistoryLength: number;
  cardStyle: CSSProperties;
  onClearHistory: () => void;
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

export function HistoryList({
  history,
  maxHistoryLength,
  cardStyle,
  onClearHistory,
}: HistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card
      className="w-full max-w-2xl rounded-3xl p-6 animate-fade-in"
      style={cardStyle}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-sky-700 dark:text-cyan-400">
          Histórico ({history.length}/{maxHistoryLength})
        </h2>

        <Button
          type="button"
          onClick={onClearHistory}
          variant="ghost"
          size="sm"
          className="text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          aria-label="Limpar histórico"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
        {history.map((item, index) => (
          <div
            key={`${item.timestamp}-${index}`}
            className="rounded-xl border border-sky-300/70 bg-white/80 p-3 shadow-sm transition-all duration-200 hover:bg-sky-50 dark:border-cyan-500/20 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <FlagImage code={item.from} sizeClass="w-5 h-5" />
                  {formatCurrency(item.amount, item.from)}
                  <span className="text-sky-600 dark:text-cyan-400">→</span>
                  <FlagImage code={item.to} sizeClass="w-5 h-5" />
                  {formatCurrency(item.result, item.to)}
                </p>

                <p className="mt-1 text-xs font-medium text-sky-700 dark:text-indigo-300">
                  Taxa: 1 {item.from} = {formatExchangeRate(item.rate)} {item.to}
                </p>
              </div>

              <p className="whitespace-nowrap text-xs font-medium text-slate-500 dark:text-indigo-400">
                {formatTimestamp(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}