"use client";

import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type PriceProps = {
  amountUsd: number;
  className?: string;
};

export function Price({ amountUsd, className }: PriceProps) {
  const { formatPrice, isHydrated } = useCurrency();

  return (
    <span className={cn(typography.price, className)}>
      {isHydrated ? formatPrice(amountUsd) : `$${amountUsd.toLocaleString("en-US")}`}
    </span>
  );
}
