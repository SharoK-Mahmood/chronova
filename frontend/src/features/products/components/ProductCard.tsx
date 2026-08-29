"use client";

import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import { ProductMediaCarousel } from "@/features/products/components/ProductMediaCarousel";
import type { ProductSummary } from "@/features/products/types/product.types";
import { WishlistButton } from "@/features/wishlist";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
  unitPriceUsd?: number;
};

export function ProductCard({
  product,
  className,
  unitPriceUsd,
}: ProductCardProps) {
  const displayPrice = unitPriceUsd ?? product.price;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(17,17,17,0.04)]",
        "md:rounded-2xl md:transition-[box-shadow,transform] md:duration-500",
        "md:hover:-translate-y-0.5 md:hover:shadow-[0_18px_40px_-24px_rgba(17,17,17,0.28)]",
        className,
      )}
    >
      <div className="relative aspect-square">
        <ProductMediaCarousel
          href={href}
          imageUrl={product.imageUrl}
          imageUrls={product.imageUrls}
          alt={imageAlt}
          sizes="(min-width: 768px) 33vw, 50vw"
        />

        <div className="absolute left-2 top-2 z-30 hidden md:block">
          <AddToCartButton
            slug={product.slug}
            productName={product.name}
            unitPriceUsd={unitPriceUsd}
          />
        </div>
        <div className="absolute right-2 top-2 z-30 md:right-3 md:top-3">
          <WishlistButton
            slug={product.slug}
            productName={product.name}
            className="h-10 w-10 p-2.5 md:h-auto md:w-auto md:p-2"
          />
        </div>
      </div>

      <Link
        href={href}
        className="flex flex-1 flex-col gap-0.5 border-t border-border/70 p-2.5 md:gap-1 md:p-3.5 lg:p-4"
      >
        <p className="truncate text-[10px] uppercase tracking-[0.22em] text-accent md:text-[11px] lg:text-xs">
          {product.brand}
        </p>
        <h3
          className={cn(
            "line-clamp-2 leading-snug md:group-hover:underline",
            typography.product,
          )}
        >
          {product.name}
        </h3>
        {product.subtitle ? (
          <p
            className={cn(
              "hidden text-secondary md:line-clamp-1 md:block",
              typography.body,
            )}
          >
            {product.subtitle}
          </p>
        ) : null}
        {product.reference ? (
          <p
            className={cn(
              "hidden text-secondary lg:block",
              typography.body,
              "text-xs",
            )}
          >
            Reference {product.reference}
          </p>
        ) : null}
        <p className="mt-1 text-accent">
          <Price amountUsd={displayPrice} />
        </p>
      </Link>
    </article>
  );
}
