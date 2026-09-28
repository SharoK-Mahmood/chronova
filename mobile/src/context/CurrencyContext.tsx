import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CURRENCIES,
  formatPrice,
  type CurrencyCode,
} from "@/src/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountUsd: number) => string;
  currencies: typeof CURRENCIES;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      format: (amountUsd: number) => formatPrice(amountUsd, currency),
      currencies: CURRENCIES,
    }),
    [currency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
