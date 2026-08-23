import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import type { ProductSummary } from "@/features/products/types/product.types";
import { WishlistButton } from "@/features/wishlist";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

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

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl sm:transition-shadow sm:hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div
          className={cn(
            "relative flex aspect-square items-center justify-center p-3 sm:p-8",
            hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-background",
          )}
        >
          <div className="absolute left-2 top-2 z-10 hidden sm:block">
            <AddToCartButton
              slug={product.slug}
              productName={product.name}
              unitPriceUsd={unitPriceUsd}
            />
          </div>
          <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
            <WishlistButton
              slug={product.slug}
              productName={product.name}
              className="h-10 w-10 p-2.5 sm:h-auto sm:w-auto sm:p-2"
            />
          </div>
          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-contain p-3 sm:p-6"
            />
          ) : (
            <div className="h-16 w-16 rounded-full border border-border bg-card shadow-sm sm:h-24 sm:w-24" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-2.5 sm:gap-1 sm:p-4">
          <p className="truncate text-[10px] uppercase tracking-widest text-accent sm:text-xs">
            {product.brand}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug sm:text-base sm:group-hover:underline">
            {product.name}
          </h3>
          {product.subtitle ? (
            <p className="hidden text-sm text-secondary sm:line-clamp-1 sm:block">
              {product.subtitle}
            </p>
          ) : null}
          {product.reference ? (
            <p className="hidden text-xs text-secondary sm:block">
              Reference {product.reference}
            </p>
          ) : null}
          <p className="mt-1 text-sm font-medium text-accent sm:mt-1">
            <Price amountUsd={displayPrice} />
          </p>
        </div>
      </Link>
    </article>
  );
}
