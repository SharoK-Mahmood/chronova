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
  readWishlistFromStorage,
  writeWishlistToStorage,
} from "@/features/wishlist/lib/wishlist-storage";

type WishlistContextValue = {
  slugs: string[];
  count: number;
  isHydrated: boolean;
  isInWishlist: (slug: string) => boolean;
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

type WishlistProviderProps = {
  children: ReactNode;
};

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSlugs(readWishlistFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      writeWishlistToStorage(slugs);
    }
  }, [slugs, isHydrated]);

  const isInWishlist = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs],
  );

  const addToWishlist = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug) ? current : [...current, slug],
    );
  }, []);

  const removeFromWishlist = useCallback((slug: string) => {
    setSlugs((current) => current.filter((item) => item !== slug));
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [
      slugs,
      isHydrated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}
