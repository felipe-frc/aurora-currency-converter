import { FlagImage } from "@/components/currency/FlagImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ConversionResult } from "@/types/currency";
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
      className="w-full max-w-2xl p-6 animate-fade-in rounded-3xl"
      style={cardStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-400">
          Histórico ({history.length}/{maxHistoryLength})
        </h2>

        <Button
          type="button"
          onClick={onClearHistory}
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
  );
}