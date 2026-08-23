import type { ProductSummary } from "@/features/products/types/product.types";

export const FEATURED_PRODUCTS: ProductSummary[] = [
  {
    id: "1",
    name: "Chronova Classic",
    slug: "chronova-classic",
    price: 249,
    currency: "USD",
    imageUrl: "/products/classic.svg",
  },
  {
    id: "2",
    name: "Chronova Sport",
    slug: "chronova-sport",
    price: 329,
    currency: "USD",
    imageUrl: "/products/sport.svg",
  },
  {
    id: "3",
    name: "Chronova Elite",
    slug: "chronova-elite",
    price: 499,
    currency: "USD",
    imageUrl: "/products/elite.svg",
  },
];

export const CATALOG_PRODUCTS: ProductSummary[] = [
  ...FEATURED_PRODUCTS,
  {
    id: "4",
    name: "Chronova Minimal",
    slug: "chronova-minimal",
    price: 199,
    currency: "USD",
    imageUrl: "/products/minimal.svg",
  },
  {
    id: "5",
    name: "Chronova Heritage",
    slug: "chronova-heritage",
    price: 599,
    currency: "USD",
    imageUrl: "/products/heritage.svg",
  },
  {
    id: "6",
    name: "Chronova Voyager",
    slug: "chronova-voyager",
    price: 379,
    currency: "USD",
    imageUrl: "/products/voyager.svg",
  },
];
