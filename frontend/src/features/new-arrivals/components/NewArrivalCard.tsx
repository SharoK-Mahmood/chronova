import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import type { NewArrival } from "@/features/new-arrivals/types/new-arrival.types";
import { WishlistButton } from "@/features/wishlist";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

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
  const { product, arrivedLabel, tagline } = arrival;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;
  const isWide = index === 0 || index === 3;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-xl",
        isWide && "sm:col-span-2",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div
          className={cn(
            "relative flex items-center justify-center bg-white p-8",
            isWide ? "aspect-[16/9]" : "aspect-square",
          )}
        >
          <div className="absolute left-3 top-3 z-10">
            <AddToCartButton slug={product.slug} productName={product.name} />
          </div>
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton slug={product.slug} productName={product.name} />
          </div>

          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              sizes={
                isWide
                  ? "(min-width: 640px) 66vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-24 w-24 rounded-full border border-border bg-background shadow-sm" />
          )}

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-background">
              New
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-secondary sm:inline">
              {arrivedLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 border-t border-border p-5">
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
        </div>
      </Link>
    </article>
  );
}
