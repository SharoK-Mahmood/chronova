"use client";

import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import { ProductMediaCarousel } from "@/features/products/components/ProductMediaCarousel";
import type { SaleItem } from "@/features/sale/types/sale.types";
import { WishlistButton } from "@/features/wishlist";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

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
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card",
        "transition-all duration-500 hover:border-accent/30 hover:shadow-[0_18px_40px_-24px_rgba(17,17,17,0.28)]",
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

        <div className="absolute left-2 top-2 z-30 hidden md:flex md:flex-col md:gap-2">
          <AddToCartButton
            slug={product.slug}
            productName={product.name}
            unitPriceUsd={salePrice}
          />
        </div>
        <div className="absolute right-2 top-2 z-30 md:right-3 md:top-3">
          <WishlistButton
            slug={product.slug}
            productName={product.name}
            className="h-10 w-10 p-2.5 md:h-auto md:w-auto md:p-2"
          />
        </div>

        <span className="pointer-events-none absolute bottom-3 left-2 z-20 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-background md:bottom-4 md:left-4 md:px-3">
          {t("sale.percentOff", { percent: discountPercent })}
        </span>
      </div>

      <Link
        href={href}
        className="flex flex-1 flex-col gap-1 border-t border-border p-2.5 md:gap-1.5 md:p-3.5 lg:gap-2 lg:p-5"
      >
        <p className="truncate text-[10px] uppercase tracking-[0.2em] text-accent md:text-[11px] lg:text-xs">
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
              "hidden line-clamp-1 text-secondary md:block",
              typography.body,
            )}
          >
            {product.subtitle}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1 md:gap-2 md:pt-2">
          <p className="text-accent">
            <Price amountUsd={salePrice} />
          </p>
          <p className={cn("text-secondary line-through", typography.body)}>
            <Price amountUsd={originalPrice} />
          </p>
        </div>
        <p className={cn("hidden text-secondary md:block", typography.body)}>
          {t("sale.saveAmount")} <Price amountUsd={savings} />
        </p>
      </Link>
    </article>
  );
}
