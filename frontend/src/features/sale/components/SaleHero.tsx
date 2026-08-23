"use client";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

type SaleHeroProps = {
  maxDiscount: number;
  itemCount: number;
};

export function SaleHero({ maxDiscount, itemCount }: SaleHeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-primary text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,162,39,0.22),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">
            {t("sale.limitedTime")}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("sale.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
            {t("sale.subtitle", { maxDiscount })}
          </p>
          <p className="mt-4 text-sm text-background/50">
            {itemCount === 1
              ? t("sale.onOfferOne")
              : t("sale.onOffer", { count: itemCount })}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#spotlight" variant="accent">
              {t("sale.bestOffer")}
            </Button>
            <Button
              href="#collection"
              variant="secondary"
              className="border-background/20 text-background hover:bg-background/10"
            >
              {t("sale.shopAllDeals")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
