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
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div
          className={cn(
            "relative flex aspect-square items-center justify-center p-8",
            hasProductPhoto(product.imageUrl) ? "bg-white" : "bg-background",
          )}
        >
          <div className="absolute left-3 top-3 z-10">
            <AddToCartButton
              slug={product.slug}
              productName={product.name}
              unitPriceUsd={unitPriceUsd}
            />
          </div>
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton slug={product.slug} productName={product.name} />
          </div>
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
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs uppercase tracking-widest text-accent">
            {product.brand}
          </p>
          <h3 className="font-medium group-hover:underline">{product.name}</h3>
          {product.subtitle ? (
            <p className="text-sm text-secondary">{product.subtitle}</p>
          ) : null}
          {product.reference ? (
            <p className="text-xs text-secondary">Reference {product.reference}</p>
          ) : null}
          <p className="mt-1 text-sm text-accent">
            <Price amountUsd={displayPrice} />
          </p>
        </div>
      </Link>
    </article>
  );
}
