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
  readWishlistFromStorage,
  writeWishlistToStorage,
} from "@/src/storage/wishlist";

type WishlistContextValue = {
  slugs: string[];
  count: number;
  isReady: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await readWishlistFromStorage();
      setSlugs(stored);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void writeWishlistToStorage(slugs);
  }, [slugs, isReady]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug],
    );
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isReady,
      has,
      toggle,
    }),
    [slugs, isReady, has, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
