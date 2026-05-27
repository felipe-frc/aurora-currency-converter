import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider defaultLanguage="pt-BR">
          <Sonner />
          <ThemeToggle />
          <LanguageToggle />
          <Router />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;