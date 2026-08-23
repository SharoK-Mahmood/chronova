import type { CurrencyCode } from "@/features/currency/constants/currency";

const CURRENCY_STORAGE_KEY = "chronova-currency";

export function readCurrencyFromStorage(): CurrencyCode {
  if (typeof window === "undefined") {
    return "USD";
  }

  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);

    if (stored === "USD" || stored === "IQD") {
      return stored;
    }

    return "USD";
  } catch {
    return "USD";
  }
}

export function writeCurrencyToStorage(currency: CurrencyCode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
}
