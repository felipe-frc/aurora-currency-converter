import React from "react";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/translations";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

const getLanguageFromDocument = (): Language => {
  return document.documentElement.lang === "en-US" ? "en-US" : "pt-BR";
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error captured by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const language = getLanguageFromDocument();
      const copy = translations[language];

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">
              {copy.unexpectedErrorTitle}
            </h1>
            <p className="text-slate-300">{copy.unexpectedErrorDescription}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
