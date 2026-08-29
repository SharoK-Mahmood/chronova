"use client";

import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import { ProductMediaCarousel } from "@/features/products/components/ProductMediaCarousel";
import type { NewArrival } from "@/features/new-arrivals/types/new-arrival.types";
import { WishlistButton } from "@/features/wishlist";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type NewArrivalCardProps = {
  arrival: NewArrival;
  index: number;
  className?: string;
};

export function NewArrivalCard({
  arrival,
  index,
  className,
}: NewArrivalCardProps) {
  const { t } = useTranslation();
  const { product, arrivedLabel, tagline } = arrival;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;
  const isWide = index === 0 || index === 3;
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card",
        "transition-all duration-500 hover:border-accent/25 hover:shadow-[0_18px_40px_-24px_rgba(17,17,17,0.28)]",
        isWide && "lg:col-span-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative",
          isWide ? "aspect-square lg:aspect-[16/9]" : "aspect-square",
        )}
      >
        <ProductMediaCarousel
          href={href}
          imageUrl={product.imageUrl}
          imageUrls={product.imageUrls}
          alt={imageAlt}
          sizes={
            isWide
              ? "(min-width: 640px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
        />

        <div className="absolute left-2 top-2 z-30 hidden md:block">
          <AddToCartButton slug={product.slug} productName={product.name} />
        </div>
        <div className="absolute right-2 top-2 z-30 md:right-3 md:top-3">
          <WishlistButton
            slug={product.slug}
            productName={product.name}
            className="h-10 w-10 p-2.5 md:h-auto md:w-auto md:p-2"
          />
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-background">
            {t("newArrivals.newBadge")}
          </span>
          <span className="hidden text-[10px] uppercase tracking-widest text-secondary sm:inline">
            {arrivedLabel}
          </span>
        </div>
      </div>

      <Link href={href} className="flex flex-1 flex-col gap-2 border-t border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
              {product.brand}
            </p>
            <h3 className="mt-1 text-lg font-medium group-hover:underline">
              {product.name}
            </h3>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-secondary">{tagline}</p>

        <p className="mt-auto pt-2 text-sm font-medium text-accent">
          <Price amountUsd={product.price} />
        </p>
      </Link>
    </article>
  );
}
