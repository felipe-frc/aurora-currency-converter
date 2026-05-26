import { FlagImage } from "@/components/currency/FlagImage";
import { CURRENCIES } from "@/data/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CSSProperties } from "react";

type CurrencySelectProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  triggerStyle?: CSSProperties;
};

export function CurrencySelect({
  id,
  label,
  value,
  onValueChange,
  className = "",
  triggerStyle,
}: CurrencySelectProps) {
  const labelId = `${id}-label`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        id={labelId}
        className="text-sm font-semibold text-slate-700 dark:text-indigo-200"
      >
        {label}
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="w-full rounded-xl border border-sky-400/50 bg-white/85 text-slate-900 shadow-sm transition-all duration-200 hover:border-sky-500 focus:border-sky-500 dark:border-cyan-500/30 dark:bg-white/10 dark:text-white dark:hover:border-cyan-400"
          style={triggerStyle}
        >
          <SelectValue>
            <span className="flex items-center gap-3">
              <FlagImage code={value} sizeClass="w-7 h-7" />
              <span className="text-sm font-semibold text-slate-800 dark:text-white">
                {value}
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={8}
          align="start"
          className="z-[9999] max-h-72 w-[min(360px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-sky-300/70 bg-white/95 text-slate-900 shadow-xl backdrop-blur-xl dark:border-cyan-500/30 dark:bg-slate-950/95 dark:text-white"
        >
          {CURRENCIES.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className="cursor-pointer rounded-lg py-3 text-slate-800 transition-colors focus:bg-sky-100 focus:text-slate-900 dark:text-white dark:focus:bg-cyan-500/15 dark:focus:text-white"
            >
              <span className="flex items-center gap-3">
                <FlagImage code={currency.code} sizeClass="w-6 h-6" />
                <span className="font-semibold">{currency.code}</span>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  ({currency.name})
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}