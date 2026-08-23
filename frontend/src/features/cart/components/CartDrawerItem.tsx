"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/features/cart/context/CartProvider";
import type { StoredCartEntry } from "@/features/cart/types/cart.types";
import { Price } from "@/features/currency";
import { getProductBySlug } from "@/features/products/data/mock-products";
import { subtleControlButtonClasses, textLinkButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type CartDrawerItemProps = {
  entry: StoredCartEntry;
  onNavigate?: () => void;
};

export function CartDrawerItem({ entry, onNavigate }: CartDrawerItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
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
    <article className="flex gap-4 rounded-2xl border border-border bg-background/60 p-3">
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={cn(
          "relative h-24 w-24 shrink-0 overflow-hidden rounded-xl",
          hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-card",
        )}
      >
        {hasProductPhoto(product.imageUrl) ? (
          <Image
            src={product.imageUrl}
            alt={imageAlt}
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 rounded-full border border-border bg-card" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          onClick={onNavigate}
          className="mt-0.5 block truncate font-medium hover:underline"
        >
          {product.name}
        </Link>
        {product.subtitle ? (
          <p className="mt-1 line-clamp-1 text-xs text-secondary">
            {product.subtitle}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-border bg-card text-sm">
            <button
              type="button"
              onClick={() => updateQuantity(entry.slug, entry.quantity - 1)}
              className={cn("rounded-full px-2.5 py-1", subtleControlButtonClasses)}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              −
            </button>
            <span className="min-w-6 text-center tabular-nums">{entry.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(entry.slug, entry.quantity + 1)}
              className={cn("rounded-full px-2.5 py-1", subtleControlButtonClasses)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              +
            </button>
          </div>

          <p className="text-sm font-semibold text-accent">
            <Price amountUsd={lineTotalUsd} />
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(entry.slug)}
          className={cn("mt-2 text-xs text-secondary", textLinkButtonClasses)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}
