export type CurrencyCode = "USD" | "IQD";

export const CURRENCIES: Record<
  CurrencyCode,
  { label: string; symbol: string; locale: string }
> = {
  USD: { label: "US Dollar", symbol: "$", locale: "en-US" },
  IQD: { label: "Iraqi Dinar", symbol: "IQD", locale: "ar-IQ" },
};

/** Fixed display rate — catalog prices are stored in USD. */
export const USD_TO_IQD_RATE = 1310;

export function formatPrice(amountUsd: number, currency: CurrencyCode): string {
  if (currency === "IQD") {
    const amount = Math.round(amountUsd * USD_TO_IQD_RATE);
    return `${amount.toLocaleString("en-US")} IQD`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountUsd);
}
