"use client";

import { CURRENCIES, type CurrencyCode } from "@/features/currency/constants/currency";
import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type CurrencySwitchProps = {
  className?: string;
};

export function CurrencySwitch({ className }: CurrencySwitchProps) {
  const { currency, setCurrency, isHydrated } = useCurrency();
  const { t } = useTranslation();
  const options = Object.keys(CURRENCIES) as CurrencyCode[];

  if (!isHydrated) {
    return (
      <div
        className={cn("h-11 w-full rounded-xl border border-border/80 bg-background/80", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      role="group"
      aria-label={t("currency.choose")}
      dir="ltr"
      className={cn(
        "grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1",
        className,
      )}
    >
      {options.map((code) => {
        const selected = currency === code;
        const label = code === "USD" ? t("currency.usDollar") : t("currency.iraqiDinar");

        return (
          <button
            key={code}
            type="button"
            aria-pressed={selected}
            onClick={() => setCurrency(code)}
            className={cn(
              "flex min-h-10 flex-col items-center justify-center rounded-lg px-2 py-1.5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              selected
                ? "bg-accent text-primary shadow-sm"
                : "text-secondary hover:bg-card hover:text-foreground",
            )}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              {code}
            </span>
            <span
              className={cn(
                "mt-0.5 text-[10px] leading-tight normal-case tracking-normal",
                selected ? "text-primary/80" : "text-secondary",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
