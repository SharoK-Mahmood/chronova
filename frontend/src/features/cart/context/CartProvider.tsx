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
  readCartFromStorage,
  writeCartToStorage,
} from "@/features/cart/lib/cart-storage";
import type { StoredCartEntry } from "@/features/cart/types/cart.types";

type AddToCartOptions = {
  quantity?: number;
  unitPriceUsd?: number;
  openDrawer?: boolean;
};

type CartContextValue = {
  entries: StoredCartEntry[];
  itemCount: number;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  isInCart: (slug: string) => boolean;
  getQuantity: (slug: string) => number;
  addToCart: (slug: string, options?: AddToCartOptions) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [entries, setEntries] = useState<StoredCartEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setEntries(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      writeCartToStorage(entries);
    }
  }, [entries, isHydrated]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDrawerOpen]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const isInCart = useCallback(
    (slug: string) => entries.some((entry) => entry.slug === slug),
    [entries],
  );

  const getQuantity = useCallback(
    (slug: string) =>
      entries.find((entry) => entry.slug === slug)?.quantity ?? 0,
    [entries],
  );

  const addToCart = useCallback(
    (slug: string, options?: AddToCartOptions) => {
      const quantity = options?.quantity ?? 1;
      const shouldOpenDrawer = options?.openDrawer ?? true;

      setEntries((current) => {
        const existing = current.find((entry) => entry.slug === slug);

        if (existing) {
          return current.map((entry) =>
            entry.slug === slug
              ? {
                  ...entry,
                  quantity: entry.quantity + quantity,
                  unitPriceUsd: options?.unitPriceUsd ?? entry.unitPriceUsd,
                }
              : entry,
          );
        }

        return [
          ...current,
          { slug, quantity, unitPriceUsd: options?.unitPriceUsd },
        ];
      });

      if (shouldOpenDrawer) {
        setIsDrawerOpen(true);
      }
    },
    [],
  );

  const removeFromCart = useCallback((slug: string) => {
    setEntries((current) => current.filter((entry) => entry.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setEntries((current) => current.filter((entry) => entry.slug !== slug));
      return;
    }

    setEntries((current) =>
      current.map((entry) =>
        entry.slug === slug ? { ...entry, quantity } : entry,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setEntries([]);
  }, []);

  const itemCount = useMemo(
    () => entries.reduce((total, entry) => total + entry.quantity, 0),
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      itemCount,
      isHydrated,
      isDrawerOpen,
      isInCart,
      getQuantity,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
    }),
    [
      entries,
      itemCount,
      isHydrated,
      isDrawerOpen,
      isInCart,
      getQuantity,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
