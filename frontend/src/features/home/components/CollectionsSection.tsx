"use client";

import Link from "next/link";

import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

const COLLECTIONS = [
  {
    href: "/men",
    eyebrowKey: "home.collections.menEyebrow",
    titleKey: "home.collections.menTitle",
    descKey: "home.collections.menDesc",
    accent: "from-primary/90 to-primary",
  },
  {
    href: "/women",
    eyebrowKey: "home.collections.womenEyebrow",
    titleKey: "home.collections.womenTitle",
    descKey: "home.collections.womenDesc",
    accent: "from-[#2a2520] to-primary",
  },
  {
    href: "/brands",
    eyebrowKey: "home.collections.brandsEyebrow",
    titleKey: "home.collections.brandsTitle",
    descKey: "home.collections.brandsDesc",
    accent: "from-[#1a1814] to-[#111111]",
  },
  {
    href: "/new-arrivals",
    eyebrowKey: "home.collections.newEyebrow",
    titleKey: "home.collections.newTitle",
    descKey: "home.collections.newDesc",
    accent: "from-primary via-[#1c1912] to-primary",
  },
] as const;

export function CollectionsSection() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-border bg-primary py-20 text-background sm:py-24">
      <Container>
        <div className="mb-12 max-w-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            {t("home.collections.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("home.collections.title")}
          </h2>
          <p className="mt-4 text-background/65">
            {t("home.collections.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group relative overflow-hidden rounded-2xl border border-background/10 p-8 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_rgba(25,40,65,0.3)] sm:p-10"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity duration-500 group-hover:opacity-100",
                  collection.accent,
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,40,65,0.14),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                  {t(collection.eyebrowKey)}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                  {t(collection.titleKey)}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-background/60">
                  {t(collection.descKey)}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  {t("common.explore")}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
