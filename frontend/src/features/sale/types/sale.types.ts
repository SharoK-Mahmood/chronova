import type { Product } from "@/features/products/types/product.types";

export type SaleItem = {
  product: Product;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  savings: number;
};

export type SaleSpotlight = SaleItem & {
  headline: string;
};
