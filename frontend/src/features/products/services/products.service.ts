import type { Product } from "@/features/products/types/product.types";
import type { ProductDetails } from "@/features/products/types/product-details.types";
import { apiClient } from "@/shared/lib/api/client";

export type ProductWriteInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  imageUrls: string[];
  category: "men" | "women" | "unisex";
  inStock?: boolean;
  brand: string;
  reference?: string | null;
  subtitle?: string | null;
  details?: ProductDetails;
};

export async function listProducts(filters?: {
  category?: string;
  brand?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters?.category) {
    params.set("category", filters.category);
  }

  if (filters?.brand) {
    params.set("brand", filters.brand);
  }

  const query = params.toString();
  return apiClient<Product[]>(query ? `/products?${query}` : "/products");
}

export async function getProduct(idOrSlug: string): Promise<Product> {
  return apiClient<Product>(`/products/${encodeURIComponent(idOrSlug)}`);
}

export async function createProduct(input: ProductWriteInput): Promise<Product> {
  return apiClient<Product>("/products", {
    method: "POST",
    body: input,
  });
}

export async function updateProduct(
  id: string,
  input: Partial<ProductWriteInput>,
): Promise<Product> {
  return apiClient<Product>(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient<void>(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
