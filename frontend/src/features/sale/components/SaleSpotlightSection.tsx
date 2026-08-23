"use client";

import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import type { SaleSpotlight } from "@/features/sale/types/sale.types";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type SaleSpotlightSectionProps = {
  item: SaleSpotlight;
};

export function SaleSpotlightSection({ item }: SaleSpotlightSectionProps) {
  const { t } = useTranslation();
  const { product, originalPrice, salePrice, discountPercent, savings, headline } =
    item;
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <section id="spotlight" className="border-b border-border bg-card py-16 sm:py-24">
      <Container>
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              {t("sale.bestOffer")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("sale.dealOfSeason")}
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent">
            {t("sale.percentOff", { percent: discountPercent })}
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Link
            href={`/products/${product.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-border bg-white"
          >
            <div className="relative aspect-square">
              {hasProductPhoto(product.imageUrl) ? (
                <Image
                  src={product.imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-10 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-background">
                  <div className="h-40 w-40 rounded-full border border-border bg-card shadow-sm" />
                </div>
              )}
            </div>
            <div className="absolute left-6 top-6 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              {t("sale.saveAmount")} <Price amountUsd={savings} />
            </div>
          </Link>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent">
                {product.brand}
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {product.name}
              </h3>
              {product.subtitle ? (
                <p className="mt-2 text-lg text-secondary">{product.subtitle}</p>
              ) : null}
              <p className="mt-4 text-sm italic text-secondary">{headline}</p>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-semibold text-accent">
                <Price amountUsd={salePrice} />
              </p>
              <p className="text-lg text-secondary line-through">
                <Price amountUsd={originalPrice} />
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <AddToCartButton
                  slug={product.slug}
                  productName={product.name}
                  unitPriceUsd={salePrice}
                  variant="button"
                />
                <Button href={`/products/${product.slug}`} variant="secondary">
                  {t("sale.shopThisDeal")}
                </Button>
              </div>
              <p className="text-sm text-secondary">
                <Price amountUsd={savings} /> ·{" "}
                {t("sale.youSave", { percent: discountPercent })}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
