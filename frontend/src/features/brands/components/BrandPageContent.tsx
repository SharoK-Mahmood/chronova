"use client";

import type { Brand } from "@/features/brands";
import type { Product } from "@/features/products";
import { ProductGrid } from "@/features/products";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type BrandPageContentProps = {
  brand: Brand;
  products: Product[];
};

export function BrandPageContent({ brand, products }: BrandPageContentProps) {
  const { t } = useTranslation();

  const availabilityLabel =
    products.length === 0
      ? t("catalog.noWatchesAvailable")
      : products.length === 1
        ? t("catalog.watchAvailable")
        : t("catalog.watchesAvailable", { count: products.length });

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-accent">
          {brand.origin}
        </p>
        <h1 className={cn("mt-2", typography.page)}>{brand.name}</h1>
        <p className={cn("mt-2 max-w-2xl text-secondary", typography.body)}>
          {brand.description}
        </p>
        <p className={cn("mt-3 text-secondary", typography.body)}>{availabilityLabel}</p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-secondary">
          {t("catalog.brandExpanding", { brand: brand.name })}
        </p>
      )}
    </Container>
  );
}
