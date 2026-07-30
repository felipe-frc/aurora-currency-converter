import type { Language } from "@/i18n/translations";

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  "pt-BR": "pt-BR",
  "en-US": "en-US",
};

export const formatCurrency = (
  value: number,
  currencyCode: string,
  language: Language = "pt-BR"
) => {
  const locale = LOCALE_BY_LANGUAGE[language];

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
};

export const formatExchangeRate = (
  value: number,
  language: Language = "pt-BR"
) => {
  const locale = LOCALE_BY_LANGUAGE[language];

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
};
