"use client";

import Image from "next/image";
import Link from "next/link";

import type { ProductSummary } from "@/features/products/types/product.types";
import { WishlistButton } from "@/features/wishlist";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type WishlistItemCardProps = {
  product: ProductSummary;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function WishlistItemCard({ product }: WishlistItemCardProps) {
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "relative flex aspect-square items-center justify-center p-8",
            hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-background",
          )}
        >
          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-6"
            />
          ) : (
            <div className="h-24 w-24 rounded-full border border-border bg-card shadow-sm" />
          )}
        </Link>
        <div className="absolute right-3 top-3">
          <WishlistButton slug={product.slug} productName={product.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">
            {product.brand}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-1 block font-medium group-hover:underline"
          >
            {product.name}
          </Link>
          {product.subtitle ? (
            <p className="mt-1 text-sm text-secondary">{product.subtitle}</p>
          ) : null}
          <p className="mt-2 text-sm text-accent">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>

        <Button href={`/products/${product.slug}`} variant="secondary" className="w-full">
          View product
        </Button>
      </div>
    </article>
  );
}
