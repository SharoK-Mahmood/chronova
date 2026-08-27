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

import { listProducts } from "@/features/products/services/products.service";
import type { Product, ProductSummary } from "@/features/products/types/product.types";

const FEATURED_SLUGS = ["land-dweller-40", "day-date-40", "sky-dweller"];

function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
    brand: product.brand,
    reference: product.reference,
    subtitle: product.subtitle,
  };
}

type ProductCatalogContextValue = {
  products: Product[];
  isLoading: boolean;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsByBrand: (brandName: string) => Product[];
  featuredProducts: ProductSummary[];
  refresh: () => Promise<void>;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(
  null,
);

type ProductCatalogProviderProps = {
  children: ReactNode;
};

export function ProductCatalogProvider({ children }: ProductCatalogProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await listProducts();
      setProducts(next);
    } catch {
      setProducts([]);
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

  const getProductsByCategory = useCallback(
    (category: string) =>
      products.filter((product) => product.category === category),
    [products],
  );

  const getProductsByBrand = useCallback(
    (brandName: string) => {
      const normalized = brandName.toLowerCase();
      return products.filter(
        (product) => product.brand.toLowerCase() === normalized,
      );
    },
    [products],
  );

  const featuredProducts = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => products.find((product) => product.slug === slug))
        .filter((product): product is Product => product !== undefined)
        .map(toSummary),
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      isLoading,
      getProductBySlug,
      getProductsByCategory,
      getProductsByBrand,
      featuredProducts,
      refresh,
    }),
    [
      products,
      isLoading,
      getProductBySlug,
      getProductsByCategory,
      getProductsByBrand,
      featuredProducts,
      refresh,
    ],
  );

  return (
    <ProductCatalogContext.Provider value={value}>
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);

  if (!context) {
    throw new Error("useProductCatalog must be used within ProductCatalogProvider");
  }

  return context;
}
