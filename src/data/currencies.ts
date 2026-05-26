import type { Currency } from "@/types/currency";

export const CURRENCIES: Currency[] = [
  {
    code: "ARS",
    name: "Peso Argentino",
    emoji: "🇦🇷",
    emojiCode: "1f1e6-1f1f7",
  },
  {
    code: "AUD",
    name: "Dólar Australiano",
    emoji: "🇦🇺",
    emojiCode: "1f1e6-1f1fa",
  },
  {
    code: "BRL",
    name: "Real Brasileiro",
    emoji: "🇧🇷",
    emojiCode: "1f1e7-1f1f7",
  },
  {
    code: "CAD",
    name: "Dólar Canadense",
    emoji: "🇨🇦",
    emojiCode: "1f1e8-1f1e6",
  },
  {
    code: "CHF",
    name: "Franco Suíço",
    emoji: "🇨🇭",
    emojiCode: "1f1e8-1f1ed",
  },
  {
    code: "CNY",
    name: "Yuan Chinês",
    emoji: "🇨🇳",
    emojiCode: "1f1e8-1f1f3",
  },
  {
    code: "EUR",
    name: "Euro",
    emoji: "🇪🇺",
    emojiCode: "1f1ea-1f1fa",
  },
  {
    code: "GBP",
    name: "Libra Esterlina",
    emoji: "🇬🇧",
    emojiCode: "1f1ec-1f1e7",
  },
  {
    code: "JPY",
    name: "Iene Japonês",
    emoji: "🇯🇵",
    emojiCode: "1f1ef-1f1f5",
  },
  {
    code: "USD",
    name: "Dólar Americano",
    emoji: "🇺🇸",
    emojiCode: "1f1fa-1f1f8",
  },
];

export const getCurrency = (code: string) => {
  return CURRENCIES.find((currency) => currency.code === code);
};

export const getCurrencyLabel = (code: string) => {
  return getCurrency(code)?.name ?? code;
};