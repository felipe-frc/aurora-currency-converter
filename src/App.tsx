import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sonner } from "@/components/ui/sonner";
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
        <Sonner />
        <ThemeToggle />
        <Router />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;