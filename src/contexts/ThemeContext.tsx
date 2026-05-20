import { useEffect } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
};

function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(defaultTheme);
  }, [defaultTheme]);

  return <>{children}</>;
}

export { ThemeProvider };