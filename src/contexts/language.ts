import { createContext } from "react";
import type { Language, TranslationKey } from "@/i18n/translations";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);