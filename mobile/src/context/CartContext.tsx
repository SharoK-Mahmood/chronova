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
  type StoredCartEntry,
} from "@/src/storage/cart";

type CartContextValue = {
  entries: StoredCartEntry[];
  itemCount: number;
  isReady: boolean;
  addItem: (slug: string, quantity?: number, unitPriceUsd?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<StoredCartEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await readCartFromStorage();
      setEntries(stored);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void writeCartToStorage(entries);
  }, [entries, isReady]);

  const addItem = useCallback(
    (slug: string, quantity = 1, unitPriceUsd?: number) => {
      setEntries((current) => {
        const existing = current.find((entry) => entry.slug === slug);
        if (existing) {
          return current.map((entry) =>
            entry.slug === slug
              ? {
                  ...entry,
                  quantity: entry.quantity + quantity,
                  unitPriceUsd: unitPriceUsd ?? entry.unitPriceUsd,
                }
              : entry,
          );
        }
        return [...current, { slug, quantity, unitPriceUsd }];
      });
    },
    [],
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setEntries((current) => {
      if (quantity <= 0) {
        return current.filter((entry) => entry.slug !== slug);
      }
      return current.map((entry) =>
        entry.slug === slug ? { ...entry, quantity } : entry,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setEntries((current) => current.filter((entry) => entry.slug !== slug));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const itemCount = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantity, 0),
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      itemCount,
      isReady,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [entries, itemCount, isReady, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
