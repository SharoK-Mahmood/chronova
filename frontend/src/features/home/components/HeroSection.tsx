"use client";

import { useEffect, useMemo, useState } from "react";

import { useProductCatalog } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import { SITE } from "@/shared/constants/site";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

const ROTATE_MS = 5500;
const MAX_HERO_VISUALS = 5;

export function HeroSection() {
  const { t } = useTranslation();
  const { products, isLoading } = useProductCatalog();
  const [activeIndex, setActiveIndex] = useState(0);
  const [entered, setEntered] = useState(false);

  const visuals = useMemo(() => {
    const withPhotos = products.filter((product) =>
      hasProductPhoto(product.imageUrl),
    );

    const preferred = withPhotos.filter(
      (product) =>
        product.imageUrl.startsWith("/uploads/") ||
        product.imageUrl.includes("/uploads/"),
    );
    const pool = preferred.length > 0 ? preferred : withPhotos;

    return pool.slice(0, MAX_HERO_VISUALS).map((product) => ({
      src: product.imageUrl,
      alt: `${product.brand} ${product.name}`,
      slug: product.slug,
    }));
  }, [products]);

  const count = visuals.length;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [count]);

  useEffect(() => {
    if (count < 2) {
      return;
    }

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [count]);

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div className="grid min-h-[min(88vh,52rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:order-1 lg:px-14 xl:px-20">
          <div
            className={cn(
              "home-hero-copy max-w-xl",
              entered && "home-hero-copy-entered",
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-accent">
              {t("site.tagline")}
            </p>

            <p
              className={cn(
                "mt-6 text-foreground",
                typography.hero,
                "text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.03em]",
              )}
            >
              {SITE.name}
            </p>

            <h1
              className={cn(
                "mt-6 max-w-md text-foreground/90",
                typography.section,
                "font-serif font-medium tracking-[-0.01em]",
              )}
            >
              {t("home.heroTitle")}{" "}
              <span className="text-accent">{t("home.heroTitleAccent")}</span>
            </h1>

            <p
              className={cn(
                "mt-5 max-w-sm text-secondary",
                typography.body,
                "leading-relaxed",
              )}
            >
              {t("home.heroSubtitle")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button href="/products" effect="luxury" className="px-7 py-3.5">
                {t("home.shopCollection")}
              </Button>
              <Button
                href="/brands"
                variant="secondary"
                effect="luxury"
                className="px-7 py-3.5"
              >
                {t("home.exploreMaisons")}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[48vh] border-t border-border bg-[#0c121c] lg:order-2 lg:min-h-0 lg:border-l lg:border-t-0 lg:border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_55%_45%,rgba(25,40,65,0.55),transparent_70%)]"
          />
          <div
            aria-hidden
            className="home-grain pointer-events-none absolute inset-0 opacity-30"
          />

          {isLoading ? (
            <div className="absolute inset-0 animate-pulse bg-[#121a28]" />
          ) : count === 0 ? null : (
            visuals.map((visual, index) => {
              const isActive = index === activeIndex % count;

              return (
                <div
                  key={visual.slug}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={!isActive}
                >
                  <ProductImage
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={cn(
                      "object-contain object-center p-8 sm:p-12 lg:p-14 xl:p-16",
                      isActive && "home-hero-ken",
                    )}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
