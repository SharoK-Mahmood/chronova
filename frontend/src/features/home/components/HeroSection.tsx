"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-primary text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(201,162,39,0.14),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,162,39,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="home-grain pointer-events-none absolute inset-0 opacity-[0.35]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <Container className="relative flex min-h-[92vh] flex-col items-center justify-center py-20 lg:py-28">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.4em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden />
            {t("site.tagline")}
            <span className="h-px w-8 bg-accent/60" aria-hidden />
          </p>
          <h1 className={cn("mt-6", typography.hero)}>
            {t("home.heroTitle")}
            <span className="mt-1 block bg-gradient-to-r from-accent via-[#e8c547] to-accent bg-clip-text text-transparent">
              {t("home.heroTitleAccent")}
            </span>
          </h1>
          <p className={cn("mx-auto mt-6 max-w-xl leading-relaxed text-background/65", typography.body)}>
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row [perspective:1200px]">
            <Button href="/products" effect="luxury" className="px-8 py-3.5 text-base">
              {t("home.shopCollection")}
            </Button>
            <Button
              href="/products/land-dweller-40"
              variant="secondary"
              effect="luxury"
              className="border-background/25 px-8 py-3.5 text-base text-background hover:border-accent/50 hover:bg-background/10"
            >
              {t("home.viewBestseller")}
            </Button>
          </div>

          <div className="relative mx-auto mt-14 w-full max-w-md sm:max-w-lg">
            <div
              aria-hidden
              className="absolute inset-[10%] rounded-full bg-accent/20 blur-3xl"
            />
            <Link
              href="/products/land-dweller-40"
              className="group relative block"
              aria-label="View Land-Dweller 40"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-background/10 bg-gradient-to-b from-white/10 to-transparent p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:rounded-[2.5rem] sm:p-12">
                <Image
                  src="/products/land-dweller-40.png"
                  alt="Rolex Land-Dweller 40"
                  fill
                  priority
                  sizes="(min-width: 768px) 32rem, 90vw"
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/30 bg-primary/90 px-5 py-2 text-xs uppercase tracking-[0.3em] text-accent backdrop-blur-sm">
                Land-Dweller 40
              </div>
            </Link>
          </div>

          <dl className="mt-16 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-background/10 pt-8">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-background/45">
                {t("home.maisons")}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-accent">10+</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-background/45">
                {t("home.timepieces")}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-accent">50+</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-background/45">
                {t("home.service")}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-accent">24/7</dd>
            </div>
          </dl>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-background/40 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.35em]">
            {t("home.scroll")}
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-accent/60 to-transparent" />
        </div>
      </Container>
    </section>
  );
}
