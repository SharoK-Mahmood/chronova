"use client";

import type { SaleItem } from "@/features/sale/types/sale.types";
import { SaleCard } from "@/features/sale/components/SaleCard";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

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
          <h2 className={cn("mt-2", typography.section)}>
            {t("sale.collectionTitle")}
          </h2>
          <p className={cn("mt-4 text-secondary", typography.body)}>{t("sale.collectionDesc")}</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:gap-6">
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
