import type { Product } from "@/features/products/types/product.types";

export type NewArrival = {
  product: Product;
  arrivedLabel: string;
  tagline: string;
};

export type NewArrivalSpotlight = NewArrival & {
  editorial: string;
};
