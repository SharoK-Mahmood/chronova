import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import type { ProductSummary } from "@/features/products/types/product.types";
import { WishlistButton } from "@/features/wishlist";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";
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
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card md:rounded-2xl md:transition-shadow md:hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div
          className={cn(
            "relative flex aspect-square items-center justify-center p-3 md:p-5 lg:p-8",
            hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-background",
          )}
        >
          <div className="absolute left-2 top-2 z-10 hidden md:block">
            <AddToCartButton
              slug={product.slug}
              productName={product.name}
              unitPriceUsd={unitPriceUsd}
            />
          </div>
          <div className="absolute right-2 top-2 z-10 md:right-3 md:top-3">
            <WishlistButton
              slug={product.slug}
              productName={product.name}
              className="h-10 w-10 p-2.5 md:h-auto md:w-auto md:p-2"
            />
          </div>
          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-contain p-3 md:p-5 lg:p-6"
            />
          ) : (
            <div className="h-16 w-16 rounded-full border border-border bg-card shadow-sm md:h-20 md:w-20 lg:h-24 lg:w-24" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-2.5 md:gap-1 md:p-3.5 lg:p-4">
          <p className="truncate text-[10px] uppercase tracking-widest text-accent md:text-[11px] lg:text-xs">
            {product.brand}
          </p>
          <h3 className={cn("line-clamp-2 leading-snug md:group-hover:underline", typography.product)}>
            {product.name}
          </h3>
          {product.subtitle ? (
            <p className={cn("hidden text-secondary md:line-clamp-1 md:block", typography.body)}>
              {product.subtitle}
            </p>
          ) : null}
          {product.reference ? (
            <p className={cn("hidden text-secondary lg:block", typography.body, "text-xs")}>
              Reference {product.reference}
            </p>
          ) : null}
          <p className="mt-1 text-accent">
            <Price amountUsd={displayPrice} />
          </p>
        </div>
      </Link>
    </article>
  );
}
