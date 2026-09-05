"use client";

import Link from "next/link";

import { useCart } from "@/features/cart/context/CartProvider";
import type { StoredCartEntry } from "@/features/cart/types/cart.types";
import { Price } from "@/features/currency";
import { useProductCatalog } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import { subtleControlButtonClasses, textLinkButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type CartLineRowProps = {
  entry: StoredCartEntry;
};

export function CartLineRow({ entry }: CartLineRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { getProductBySlug } = useProductCatalog();
  const product = getProductBySlug(entry.slug);

  if (!product) {
    return null;
  }

  const unitPriceUsd = entry.unitPriceUsd ?? product.price;
  const lineTotalUsd = unitPriceUsd * entry.quantity;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <article className="flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-center">
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24",
          hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-background",
        )}
      >
        {hasProductPhoto(product.imageUrl) ? (
          <ProductImage
            src={product.imageUrl}
            alt={imageAlt}
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 rounded-full border border-border bg-card" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-accent">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 block font-medium hover:underline"
        >
          {product.name}
        </Link>
        {product.subtitle ? (
          <p className="mt-1 text-sm text-secondary">{product.subtitle}</p>
        ) : null}
        <p className="mt-2 text-sm text-accent">
          <Price amountUsd={unitPriceUsd} /> each
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => updateQuantity(entry.slug, entry.quantity - 1)}
            className={cn("px-3 py-1.5 text-sm", subtleControlButtonClasses)}
            aria-label={`Decrease quantity of ${product.name}`}
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm tabular-nums">
            {entry.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(entry.slug, entry.quantity + 1)}
            className={cn("px-3 py-1.5 text-sm", subtleControlButtonClasses)}
            aria-label={`Increase quantity of ${product.name}`}
          >
            +
          </button>
        </div>

        <p className="text-base font-medium">
          <Price amountUsd={lineTotalUsd} />
        </p>

        <button
          type="button"
          onClick={() => removeFromCart(entry.slug)}
          className={cn("text-sm text-secondary", textLinkButtonClasses)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}
