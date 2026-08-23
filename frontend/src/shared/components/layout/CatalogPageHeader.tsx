"use client";

import { useTranslation } from "@/shared/i18n";

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
    <div className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-2 max-w-2xl text-secondary">{t(descriptionKey)}</p>
      {count !== undefined ? (
        <p className="mt-3 text-sm text-secondary">
          {count === 1
            ? t("search.watchFound")
            : t("search.watchesFound", { count })}
        </p>
      ) : null}
      {emptyKey && count === 0 ? (
        <p className="mt-6 text-secondary">{t(emptyKey)}</p>
      ) : null}
    </div>
  );
}
