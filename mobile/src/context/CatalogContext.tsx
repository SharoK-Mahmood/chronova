import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiClient } from "@/src/lib/api";
import type { Product } from "@/src/types/product";

type CatalogContextValue = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<Product[]>("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((product) => product.slug === slug),
    [products],
  );

  const value = useMemo(
    () => ({ products, isLoading, error, refresh, getProductBySlug }),
    [products, isLoading, error, refresh, getProductBySlug],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}
