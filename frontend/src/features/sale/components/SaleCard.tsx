"use client";

import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import type { SaleItem } from "@/features/sale/types/sale.types";
import { WishlistButton } from "@/features/wishlist";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type SaleCardProps = {
  item: SaleItem;
  className?: string;
};

export function SaleCard({ item, className }: SaleCardProps) {
  const { t } = useTranslation();
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
        <div className="relative flex aspect-square items-center justify-center bg-white p-3 md:p-5 lg:p-8">
          <div className="absolute left-2 top-2 z-10 hidden md:flex md:flex-col md:gap-2">
            <AddToCartButton
              slug={product.slug}
              productName={product.name}
              unitPriceUsd={salePrice}
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
              className="object-contain p-3 md:p-5 lg:p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-16 w-16 rounded-full border border-border bg-background shadow-sm md:h-20 md:w-20 lg:h-24 lg:w-24" />
          )}

          <span className="absolute bottom-3 left-2 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary md:bottom-4 md:left-4 md:px-3">
            {t("sale.percentOff", { percent: discountPercent })}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1 border-t border-border p-2.5 md:gap-1.5 md:p-3.5 lg:gap-2 lg:p-5">
          <p className="truncate text-[10px] uppercase tracking-[0.2em] text-accent md:text-[11px] lg:text-xs">
            {product.brand}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug md:text-[15px] lg:text-lg md:group-hover:underline">
            {product.name}
          </h3>
          {product.subtitle ? (
            <p className="hidden line-clamp-1 text-sm text-secondary md:block">
              {product.subtitle}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1 md:gap-2 md:pt-2">
            <p className="text-sm font-semibold text-accent md:text-[15px] lg:text-lg">
              <Price amountUsd={salePrice} />
            </p>
            <p className="text-xs text-secondary line-through md:text-sm">
              <Price amountUsd={originalPrice} />
            </p>
          </div>
          <p className="hidden text-xs text-secondary md:block">
            {t("sale.saveAmount")} <Price amountUsd={savings} />
          </p>
        </div>
      </Link>
    </article>
  );
}
