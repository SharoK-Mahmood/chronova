import type { ProductSummary } from "@/features/products/types/product.types";

export type CartItem = {
  product: ProductSummary;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  currency: string;
};
