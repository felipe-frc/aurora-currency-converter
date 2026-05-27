import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/useLanguage";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { Languages } from "lucide-react";
import { Route, Switch } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LanguageButton() {
  const { language, toggleLanguage, t } = useLanguage();

  const nextLanguageLabel = language === "pt-BR" ? "EN" : "PT";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="fixed right-4 top-20 z-50 inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-sky-300/80 bg-white/90 px-3 text-sm font-bold text-sky-700 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-cyan-500/30 dark:bg-white/10 dark:text-cyan-300 dark:hover:border-cyan-400 dark:hover:bg-cyan-500/20 dark:hover:text-white dark:focus-visible:ring-cyan-400 dark:focus-visible:ring-offset-slate-950"
      aria-label={t("toggleLanguage")}
      title={t("toggleLanguage")}
    >
      <Languages className="h-4 w-4" />
      <span>{nextLanguageLabel}</span>
    </button>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider defaultLanguage="pt-BR">
          <Sonner />
          <ThemeToggle />
          <LanguageButton />
          <Router />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;