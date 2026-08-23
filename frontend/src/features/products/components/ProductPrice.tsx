"use client";

import { Price } from "@/features/currency";

type ProductPriceProps = {
  amountUsd: number;
  className?: string;
};

export function ProductPrice({ amountUsd, className }: ProductPriceProps) {
  return <Price amountUsd={amountUsd} className={className} />;
}
