import Image from "next/image";
import Link from "next/link";

import type { ProductSummary } from "@/features/products/types/product.types";
import { cn } from "@/shared/lib/utils/cn";

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

function hasProductPhoto(imageUrl: string): boolean {
  return /\.(png|jpe?g|webp)$/i.test(imageUrl);
}

export function ProductCard({ product, className }: ProductCardProps) {
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
            hasProductPhoto(product.imageUrl) ? "bg-black" : "bg-background",
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
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
