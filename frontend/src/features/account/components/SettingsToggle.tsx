"use client";

import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type SettingsToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: SettingsToggleProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-border bg-background/50 px-3 py-3.5 transition-colors hover:border-accent/20 sm:gap-4 sm:px-4">
      <div className="min-w-0 pe-2">
        <span className={cn("block", typography.label)}>{label}</span>
        {description ? (
          <span className={cn("mt-0.5 block text-secondary", typography.body)}>
            {description}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        dir="ltr"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2",
          checked ? "bg-accent" : "bg-border",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "block h-5 w-5 rounded-full bg-card shadow-sm transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
