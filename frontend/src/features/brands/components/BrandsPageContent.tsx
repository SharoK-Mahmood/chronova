"use client";

import type { BrandSummary } from "@/features/brands";
import { BrandGrid } from "@/features/brands";
import { useTranslation } from "@/shared/i18n";

type BrandsPageContentProps = {
  brands: BrandSummary[];
};

export function BrandsPageContent({ brands }: BrandsPageContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("catalog.brandsTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-secondary">{t("catalog.brandsDesc")}</p>
        <p className="mt-3 text-sm text-secondary">
          {brands.length === 1
            ? t("catalog.brandCountOne")
            : t("catalog.brandCount", { count: brands.length })}
        </p>
      </div>
      <BrandGrid brands={brands} />
    </>
  );
}
