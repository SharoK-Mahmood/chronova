"use client";

import type { NewArrival } from "@/features/new-arrivals/types/new-arrival.types";
import { NewArrivalCard } from "@/features/new-arrivals/components/NewArrivalCard";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";

type NewArrivalsCollectionProps = {
  arrivals: NewArrival[];
};

export function NewArrivalsCollection({
  arrivals,
}: NewArrivalsCollectionProps) {
  const { t } = useTranslation();

  return (
    <section id="collection" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t("newArrivals.collectionEyebrow")}
          </p>
          <h2 className={cn("mt-2", typography.section)}>
            {t("newArrivals.collectionTitle")}
          </h2>
          <p className={cn("mt-4 text-secondary", typography.body)}>
            {t("newArrivals.collectionDesc")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:gap-6">
          {arrivals.map((arrival, index) => (
            <NewArrivalCard
              key={arrival.product.id}
              arrival={arrival}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
