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
