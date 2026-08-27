"use client";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function HomeCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-t border-border bg-primary py-24 text-background sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(25,40,65,0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      <Container className="relative text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">
          {t("home.cta.eyebrow")}
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("home.cta.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-background/65">
          {t("home.cta.subtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row [perspective:1200px]">
          <Button href="/products" effect="luxury" className="px-8 py-3.5 text-base">
            {t("home.cta.explore")}
          </Button>
          <Button
            href="/sale"
            variant="secondary"
            effect="luxury"
            className="border-background/25 text-background hover:border-accent/50 hover:bg-background/10 px-8 py-3.5 text-base"
          >
            {t("home.cta.viewSale")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
