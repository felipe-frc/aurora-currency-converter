import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };