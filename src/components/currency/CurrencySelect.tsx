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
      <label id={labelId} className="text-sm font-medium text-indigo-200">
        {label}
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="w-full bg-white/10 border-cyan-500/30 text-white rounded-xl text-lg font-semibold"
          style={triggerStyle}
        >
          <SelectValue>
            <span className="flex items-center gap-3">
              <FlagImage code={value} sizeClass="w-7 h-7" />
              <span className="text-sm font-medium">{value}</span>
            </span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={8}
          align="start"
          className="z-[9999] w-[min(360px,calc(100vw-2rem))] max-h-72 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 text-white backdrop-blur-xl"
        >
          {CURRENCIES.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className="cursor-pointer rounded-lg py-3 focus:bg-cyan-500/15 focus:text-white"
            >
              <span className="flex items-center gap-3">
                <FlagImage code={currency.code} sizeClass="w-6 h-6" />
                <span className="font-semibold">{currency.code}</span>
                <span className="text-xs text-gray-400">
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