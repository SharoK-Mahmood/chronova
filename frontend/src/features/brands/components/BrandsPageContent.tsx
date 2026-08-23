"use client";

import type { BrandSummary } from "@/features/brands";
import { BrandGrid } from "@/features/brands";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type BrandsPageContentProps = {
  brands: BrandSummary[];
};

export function BrandsPageContent({ brands }: BrandsPageContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-10">
        <h1 className={typography.page}>{t("catalog.brandsTitle")}</h1>
        <p className={cn("mt-2 max-w-2xl text-secondary", typography.body)}>
          {t("catalog.brandsDesc")}
        </p>
        <p className={cn("mt-3 text-secondary", typography.body)}>
          {brands.length === 1
            ? t("catalog.brandCountOne")
            : t("catalog.brandCount", { count: brands.length })}
        </p>
      </div>
      <BrandGrid brands={brands} />
    </>
  );
}
