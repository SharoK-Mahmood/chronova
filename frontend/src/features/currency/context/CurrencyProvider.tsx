"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CURRENCIES,
  USD_TO_IQD_RATE,
  type CurrencyCode,
} from "@/features/currency/constants/currency";
import {
  readCurrencyFromStorage,
  writeCurrencyToStorage,
} from "@/features/currency/lib/currency-storage";

type CurrencyContextValue = {
  currency: CurrencyCode;
  isHydrated: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountUsd: number) => string;
  convertFromUsd: (amountUsd: number) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

type CurrencyProviderProps = {
  children: ReactNode;
};

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCurrencyState(readCurrencyFromStorage());
    setIsHydrated(true);
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    writeCurrencyToStorage(next);
  }, []);

  const convertFromUsd = useCallback(
    (amountUsd: number) => {
      if (currency === "IQD") {
        return Math.round(amountUsd * USD_TO_IQD_RATE);
      }

      return amountUsd;
    },
    [currency],
  );

  const formatPrice = useCallback(
    (amountUsd: number) => {
      const value = convertFromUsd(amountUsd);
      const { locale } = CURRENCIES[currency];

      if (currency === "IQD") {
        return new Intl.NumberFormat(locale, {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(value) + " IQD";
      }

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
    [convertFromUsd, currency],
  );

  const value = useMemo(
    () => ({
      currency,
      isHydrated,
      setCurrency,
      formatPrice,
      convertFromUsd,
    }),
    [currency, isHydrated, setCurrency, formatPrice, convertFromUsd],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
