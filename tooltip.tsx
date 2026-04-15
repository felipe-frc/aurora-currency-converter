import type { ReactNode } from "react";

type TooltipProviderProps = {
  children: ReactNode;
};

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}
