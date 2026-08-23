"use client";

import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type PriceProps = {
  amountUsd: number;
  className?: string;
  /** Compact text for dense lists (avoids display price scale overflow). */
  size?: "display" | "inline";
};

export function Price({
  amountUsd,
  className,
  size = "display",
}: PriceProps) {
  const { formatPrice, isHydrated } = useCurrency();

  return (
    <span
      className={cn(
        size === "display" ? typography.price : "font-medium tabular-nums",
        className,
      )}
    >
      {isHydrated
        ? formatPrice(amountUsd)
        : `$${amountUsd.toLocaleString("en-US")}`}
    </span>
  );
}
