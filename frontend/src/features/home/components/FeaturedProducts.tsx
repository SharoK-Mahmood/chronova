"use client";

import { FEATURED_PRODUCTS, ProductGrid } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function FeaturedProducts() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-20 lg:py-28">
      <Container>
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:mb-14 sm:gap-6 sm:pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              {t("home.featured.eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-4xl">
              {t("home.featured.title")}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-secondary sm:mt-3 sm:text-base">
              {t("home.featured.subtitle")}
            </p>
          </div>
          <Button href="/products" variant="secondary" effect="luxury" className="shrink-0">
            {t("common.viewAll")}
          </Button>
        </div>

        <ProductGrid products={FEATURED_PRODUCTS} />
      </Container>
    </section>
  );
}
