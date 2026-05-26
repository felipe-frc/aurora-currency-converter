import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  ThemeContext,
} from "@/contexts/theme";
import type { Theme } from "@/contexts/theme";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
};

const getStoredTheme = (defaultTheme: Theme): Theme => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return defaultTheme;
  } catch {
    return defaultTheme;
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(defaultTheme)
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(theme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage pode falhar em ambientes restritos.
    }
  }, [theme]);

  const setTheme = (selectedTheme: Theme) => {
    setThemeState(selectedTheme);
  };

  const toggleTheme = () => {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}