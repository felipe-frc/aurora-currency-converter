import { useTheme } from "@/contexts/useTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-300/80 bg-white/90 text-sky-700 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-cyan-500/30 dark:bg-white/10 dark:text-cyan-300 dark:hover:border-cyan-400 dark:hover:bg-cyan-500/20 dark:hover:text-white dark:focus-visible:ring-cyan-400 dark:focus-visible:ring-offset-slate-950"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}