import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LanguageContext } from "@/contexts/language";
import { LANGUAGE_STORAGE_KEY, translations } from "@/i18n/translations";
import type { Language, TranslationKey } from "@/i18n/translations";

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
};

const getStoredLanguage = (defaultLanguage: Language): Language => {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "pt-BR" || storedLanguage === "en-US") {
      return storedLanguage;
    }

    return defaultLanguage;
  } catch {
    return defaultLanguage;
  }
};

export function LanguageProvider({
  children,
  defaultLanguage = "pt-BR",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() =>
    getStoredLanguage(defaultLanguage)
  );

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // localStorage pode falhar em ambientes restritos.
    }
  }, [language]);

  const setLanguage = useCallback((selectedLanguage: Language) => {
    setLanguageState(selectedLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((currentLanguage) =>
      currentLanguage === "pt-BR" ? "en-US" : "pt-BR"
    );
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key];
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}