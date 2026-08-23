"use client";

import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type CatalogPageHeaderProps = {
  titleKey: string;
  descriptionKey: string;
  count?: number;
  emptyKey?: string;
};

export function CatalogPageHeader({
  titleKey,
  descriptionKey,
  count,
  emptyKey,
}: CatalogPageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 md:mb-10">
      <h1 className={typography.page}>{t(titleKey)}</h1>
      <p className={cn("mt-2 max-w-2xl text-secondary", typography.body)}>
        {t(descriptionKey)}
      </p>
      {count !== undefined ? (
        <p className={cn("mt-3 text-secondary", typography.body)}>
          {count === 1
            ? t("search.watchFound")
            : t("search.watchesFound", { count })}
        </p>
      ) : null}
      {emptyKey && count === 0 ? (
        <p className={cn("mt-6 text-secondary", typography.body)}>
          {t(emptyKey)}
        </p>
      ) : null}
    </div>
  );
}
