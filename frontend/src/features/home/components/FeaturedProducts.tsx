"use client";

import { FEATURED_PRODUCTS, ProductGrid } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";

export function FeaturedProducts() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 lg:py-28">
      <Container>
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-8 lg:mb-14 lg:pb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              {t("home.featured.eyebrow")}
            </p>
            <h2 className={cn("mt-2 md:mt-3", typography.section)}>
              {t("home.featured.title")}
            </h2>
            <p className={cn("mt-2 max-w-lg text-secondary md:mt-3", typography.body)}>
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
