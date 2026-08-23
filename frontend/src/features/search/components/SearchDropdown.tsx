"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { buildSearchUrl } from "@/features/search/constants/search-categories";
import type { SearchResults } from "@/features/search/types/search.types";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type SearchDropdownProps = {
  results: SearchResults;
  onNavigate?: () => void;
  className?: string;
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  watches: "search.categoryLabels.watches",
  men: "search.categoryLabels.men",
  women: "search.categoryLabels.women",
  "new-arrivals": "search.categoryLabels.newArrivals",
  sale: "search.categoryLabels.sale",
  brands: "search.categoryLabels.brands",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-accent">
      {children}
    </p>
  );
}

function ResultLink({
  href,
  title,
  subtitle,
  onNavigate,
}: {
  href: string;
  title: string;
  subtitle?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-background"
    >
      <p className="text-[13px] text-foreground">{title}</p>
      {subtitle ? (
        <p className="mt-0.5 text-[11px] text-secondary">{subtitle}</p>
      ) : null}
    </Link>
  );
}

const dropdownShellClass =
  "flex max-h-[min(28rem,calc(100dvh-11.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)] lg:max-h-[min(28rem,calc(100dvh-8rem))]";

export function SearchDropdown({
  results,
  onNavigate,
  className,
}: SearchDropdownProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const hasQuery = results.query.length > 0;
  const hasResults =
    results.watches.length > 0 ||
    results.brands.length > 0 ||
    results.categories.length > 0;

  if (!hasQuery) {
    return null;
  }

  function goToAllResults() {
    router.push(buildSearchUrl(results.query));
    onNavigate?.();
  }

  if (!hasResults) {
    return (
      <div className={cn(dropdownShellClass, className)}>
        <div className="min-h-0 overflow-y-auto overscroll-contain py-4">
          <p className="px-4 text-sm text-secondary">
            {t("common.noResults", { query: results.query })}
          </p>
          <button
            type="button"
            onClick={goToAllResults}
            className="mt-3 w-full px-4 text-left text-sm font-medium text-accent hover:underline"
          >
            {t("common.searchCatalog")}
          </button>
        </div>
      </div>
    );
  }

  const primaryBrand = results.brands[0]?.name;

  return (
    <div className={cn(dropdownShellClass, className)}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {results.watches.length > 0 ? (
          <div className="border-b border-border/80 pb-1">
            <SectionLabel>{t("search.matchingWatches")}</SectionLabel>
            {results.watches.map((watch) => (
              <ResultLink
                key={watch.slug}
                href={`/products/${watch.slug}`}
                title={`${watch.brand} ${watch.name}`}
                subtitle={watch.subtitle}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}

        {results.brands.length > 0 ? (
          <div className="border-b border-border/80 pb-1">
            <SectionLabel>{t("search.brandMatches")}</SectionLabel>
            {results.brands.map((brand) => (
              <ResultLink
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                title={brand.name}
                subtitle={t("search.viewBrandCollection")}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}

        {results.categories.length > 0 ? (
          <div className="pb-1">
            <SectionLabel>{t("search.categories")}</SectionLabel>
            {results.categories.map((category) => (
              <ResultLink
                key={category.id}
                href={category.href}
                title={t(CATEGORY_LABEL_KEYS[category.id] ?? category.id)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={goToAllResults}
        className="flex w-full shrink-0 items-center justify-between border-t border-border px-4 py-3 text-left text-[13px] font-medium text-accent transition-colors hover:bg-accent/5"
      >
        <span>
          {primaryBrand
            ? t("common.viewAllBrandResults", { brand: primaryBrand })
            : t("common.viewAllResults")}
        </span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
