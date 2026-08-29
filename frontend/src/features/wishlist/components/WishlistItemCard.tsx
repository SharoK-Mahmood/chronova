"use client";

import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import { ProductMediaCarousel } from "@/features/products/components/ProductMediaCarousel";
import type { ProductSummary } from "@/features/products/types/product.types";
import { WishlistButton } from "@/features/wishlist";
import { Button } from "@/shared/components/ui/Button";

type WishlistItemCardProps = {
  product: ProductSummary;
};

export function WishlistItemCard({ product }: WishlistItemCardProps) {
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-shadow duration-500 hover:shadow-[0_18px_40px_-24px_rgba(17,17,17,0.28)]">
      <div className="relative aspect-square">
        <ProductMediaCarousel
          href={href}
          imageUrl={product.imageUrl}
          imageUrls={product.imageUrls}
          alt={imageAlt}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute right-3 top-3 z-30">
          <WishlistButton slug={product.slug} productName={product.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-border p-5">
        <Link href={href}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {product.brand}
          </p>
          <h3 className="mt-1 text-lg font-medium group-hover:underline">
            {product.name}
          </h3>
          {product.subtitle ? (
            <p className="mt-1 line-clamp-1 text-sm text-secondary">
              {product.subtitle}
            </p>
          ) : null}
          <p className="mt-3 text-accent">
            <Price amountUsd={product.price} />
          </p>
        </Link>

        <div className="mt-auto flex gap-2">
          <AddToCartButton
            slug={product.slug}
            productName={product.name}
            variant="button"
            className="flex-1"
          />
          <Button href={href} variant="secondary" className="flex-1">
            View
          </Button>
        </div>
      </div>
    </article>
  );
}
