"use client";

import { CURRENCIES, type CurrencyCode } from "@/features/currency/constants/currency";
import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { cn } from "@/shared/lib/utils/cn";

type CurrencySelectorProps = {
  className?: string;
};

export function CurrencySelector({ className }: CurrencySelectorProps) {
  const { currency, setCurrency, isHydrated } = useCurrency();

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "h-9 w-[5.5rem] rounded-full border border-border bg-background",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <label htmlFor="currency-select" className="sr-only">
        Display currency
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-all duration-200 hover:scale-[1.02] hover:border-accent/50 hover:shadow-md hover:ring-2 hover:ring-accent/20 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        aria-label="Choose display currency"
      >
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
}
