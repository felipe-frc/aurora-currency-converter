import type { Language } from "@/i18n/translations";
import type { Currency } from "@/types/currency";

export const CURRENCIES: Currency[] = [
  {
    code: "ARS",
    names: {
      "pt-BR": "Peso Argentino",
      "en-US": "Argentine Peso",
    },
    emoji: "🇦🇷",
    emojiCode: "1f1e6-1f1f7",
  },
  {
    code: "AUD",
    names: {
      "pt-BR": "Dólar Australiano",
      "en-US": "Australian Dollar",
    },
    emoji: "🇦🇺",
    emojiCode: "1f1e6-1f1fa",
  },
  {
    code: "BRL",
    names: {
      "pt-BR": "Real Brasileiro",
      "en-US": "Brazilian Real",
    },
    emoji: "🇧🇷",
    emojiCode: "1f1e7-1f1f7",
  },
  {
    code: "CAD",
    names: {
      "pt-BR": "Dólar Canadense",
      "en-US": "Canadian Dollar",
    },
    emoji: "🇨🇦",
    emojiCode: "1f1e8-1f1e6",
  },
  {
    code: "CHF",
    names: {
      "pt-BR": "Franco Suíço",
      "en-US": "Swiss Franc",
    },
    emoji: "🇨🇭",
    emojiCode: "1f1e8-1f1ed",
  },
  {
    code: "CNY",
    names: {
      "pt-BR": "Yuan Chinês",
      "en-US": "Chinese Yuan",
    },
    emoji: "🇨🇳",
    emojiCode: "1f1e8-1f1f3",
  },
  {
    code: "EUR",
    names: {
      "pt-BR": "Euro",
      "en-US": "Euro",
    },
    emoji: "🇪🇺",
    emojiCode: "1f1ea-1f1fa",
  },
  {
    code: "GBP",
    names: {
      "pt-BR": "Libra Esterlina",
      "en-US": "British Pound",
    },
    emoji: "🇬🇧",
    emojiCode: "1f1ec-1f1e7",
  },
  {
    code: "JPY",
    names: {
      "pt-BR": "Iene Japonês",
      "en-US": "Japanese Yen",
    },
    emoji: "🇯🇵",
    emojiCode: "1f1ef-1f1f5",
  },
  {
    code: "USD",
    names: {
      "pt-BR": "Dólar Americano",
      "en-US": "US Dollar",
    },
    emoji: "🇺🇸",
    emojiCode: "1f1fa-1f1f8",
  },
];

export const getCurrency = (code: string) => {
  return CURRENCIES.find((currency) => currency.code === code);
};

export const getCurrencyLabel = (
  code: string,
  language: Language = "pt-BR"
) => {
  return getCurrency(code)?.names[language] ?? code;
};
