"use client";

import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

const PILLAR_KEYS = [
  { titleKey: "home.heritage.craft", descKey: "home.heritage.craftDesc" },
  { titleKey: "home.heritage.curated", descKey: "home.heritage.curatedDesc" },
  { titleKey: "home.heritage.service", descKey: "home.heritage.serviceDesc" },
] as const;

export function HeritageSection() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-border bg-card">
      <Container className="max-w-5xl py-12 sm:py-14">
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 md:divide-x md:divide-border">
          {PILLAR_KEYS.map((pillar) => (
            <div key={pillar.titleKey} className="px-0 md:px-6 md:first:pl-0 md:last:pr-0">
              <p className="text-xs uppercase tracking-[0.35em] text-accent">
                {t(pillar.titleKey)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {t(pillar.descKey)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
