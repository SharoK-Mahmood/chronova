"use client";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function NewArrivalsCta() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border bg-primary py-16 text-background sm:py-20">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          {t("newArrivals.exclusiveAccess")}
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("newArrivals.ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-background/70">
          {t("newArrivals.ctaDesc")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/products" variant="accent">
            {t("newArrivals.shopAllWatches")}
          </Button>
          <Button
            href="/brands"
            variant="secondary"
            className="border-background/20 text-background hover:bg-background/10"
          >
            {t("newArrivals.exploreBrands")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
