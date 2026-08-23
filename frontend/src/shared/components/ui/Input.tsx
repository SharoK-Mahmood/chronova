import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type InputProps = ComponentPropsWithoutRef<"input">;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full min-w-0 rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors",
        typography.body,
        "placeholder:text-secondary/70",
        "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
