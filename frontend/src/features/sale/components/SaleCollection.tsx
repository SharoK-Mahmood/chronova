"use client";

import type { SaleItem } from "@/features/sale/types/sale.types";
import { SaleCard } from "@/features/sale/components/SaleCard";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

type SaleCollectionProps = {
  items: SaleItem[];
};

export function SaleCollection({ items }: SaleCollectionProps) {
  const { t } = useTranslation();

  return (
    <section id="collection" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t("sale.allDeals")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("sale.collectionTitle")}
          </h2>
          <p className="mt-4 text-secondary">{t("sale.collectionDesc")}</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
            {items.map((item) => (
              <SaleCard key={item.product.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-secondary">{t("sale.noItems")}</p>
        )}
      </Container>
    </section>
  );
}
