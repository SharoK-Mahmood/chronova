import Image from "next/image";
import Link from "next/link";

import type { SaleItem } from "@/features/sale/types/sale.types";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type SaleCardProps = {
  item: SaleItem;
  className?: string;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function SaleCard({ item, className }: SaleCardProps) {
  const { product, originalPrice, salePrice, discountPercent, savings } = item;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/40 hover:shadow-xl",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative flex aspect-square items-center justify-center bg-white p-8">
          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-24 w-24 rounded-full border border-border bg-background shadow-sm" />
          )}

          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
            −{discountPercent}%
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 border-t border-border p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {product.brand}
          </p>
          <h3 className="text-lg font-medium group-hover:underline">
            {product.name}
          </h3>
          {product.subtitle ? (
            <p className="line-clamp-1 text-sm text-secondary">
              {product.subtitle}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
            <p className="text-lg font-semibold text-accent">
              {formatPrice(salePrice, product.currency)}
            </p>
            <p className="text-sm text-secondary line-through">
              {formatPrice(originalPrice, product.currency)}
            </p>
          </div>
          <p className="text-xs text-secondary">
            Save {formatPrice(savings, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
