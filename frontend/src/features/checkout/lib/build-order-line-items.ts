import type { StoredCartEntry } from "@/features/cart/types/cart.types";
import type { OrderLineItem } from "@/features/checkout/types/checkout.types";
import type { Product } from "@/features/products/types/product.types";

export function buildOrderLineItems(
  entries: StoredCartEntry[],
  getProductBySlug: (slug: string) => Product | undefined,
): OrderLineItem[] {
  return entries.flatMap((entry) => {
    const product = getProductBySlug(entry.slug);
    if (!product) {
      return [];
    }

    return [
      {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        subtitle: product.subtitle,
        imageUrl: product.imageUrl,
        quantity: entry.quantity,
        unitPriceUsd: entry.unitPriceUsd ?? product.price,
      },
    ];
  });
}

export function calculateSubtotalUsd(lineItems: OrderLineItem[]): number {
  return lineItems.reduce(
    (total, item) => total + item.unitPriceUsd * item.quantity,
    0,
  );
}
