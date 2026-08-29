import type { ProductDetails } from "@/features/products/types/product-details.types";

export type ProductCategory = "men" | "women" | "unisex";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  /** Full gallery; falls back to `[imageUrl]` when omitted. */
  imageUrls?: string[];
  category: ProductCategory | string;
  inStock: boolean;
  brand: string;
  reference?: string;
  subtitle?: string;
  details?: ProductDetails;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "currency"
  | "imageUrl"
  | "imageUrls"
  | "brand"
  | "reference"
  | "subtitle"
>;
