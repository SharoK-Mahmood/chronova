"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/features/cart/context/CartProvider";
import type { StoredCartEntry } from "@/features/cart/types/cart.types";
import { Price } from "@/features/currency";
import { getProductBySlug } from "@/features/products/data/mock-products";
import { useTranslation } from "@/shared/i18n";
import {
  subtleControlButtonClasses,
  textLinkButtonClasses,
} from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type CartDrawerItemProps = {
  entry: StoredCartEntry;
  onNavigate?: () => void;
};

export function CartDrawerItem({ entry, onNavigate }: CartDrawerItemProps) {
  const { t } = useTranslation();
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
    <article className="flex gap-3 rounded-xl border border-border bg-background/60 p-2.5">
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={cn(
          "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg",
          hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-card",
        )}
      >
        {hasProductPhoto(product.imageUrl) ? (
          <Image
            src={product.imageUrl}
            alt={imageAlt}
            fill
            sizes="72px"
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-7 w-7 rounded-full border border-border bg-card" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-accent">
            {product.brand}
          </p>
          <Link
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="mt-0.5 block text-sm font-medium leading-snug hover:underline"
          >
            {product.name}
          </Link>
          {product.subtitle ? (
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-secondary">
              {product.subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center rounded-full border border-border bg-card text-xs">
            <button
              type="button"
              onClick={() => updateQuantity(entry.slug, entry.quantity - 1)}
              className={cn(
                "rounded-full px-2 py-0.5",
                subtleControlButtonClasses,
              )}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              −
            </button>
            <span className="min-w-5 text-center tabular-nums">
              {entry.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(entry.slug, entry.quantity + 1)}
              className={cn(
                "rounded-full px-2 py-0.5",
                subtleControlButtonClasses,
              )}
              aria-label={`Increase quantity of ${product.name}`}
            >
              +
            </button>
          </div>

          <p className="shrink-0 text-sm font-semibold tabular-nums text-accent">
            <Price amountUsd={lineTotalUsd} />
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(entry.slug)}
          className={cn(
            "mt-1.5 self-start text-[11px] text-secondary",
            textLinkButtonClasses,
          )}
        >
          {t("common.remove")}
        </button>
      </div>
    </article>
  );
}
