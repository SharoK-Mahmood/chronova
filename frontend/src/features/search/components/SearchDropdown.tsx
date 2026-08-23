"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { buildSearchUrl } from "@/features/search/constants/search-categories";
import type { SearchResults } from "@/features/search/types/search.types";
import { cn } from "@/shared/lib/utils/cn";

type SearchDropdownProps = {
  results: SearchResults;
  onNavigate?: () => void;
  className?: string;
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

export function SearchDropdown({
  results,
  onNavigate,
  className,
}: SearchDropdownProps) {
  const router = useRouter();
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
      <div
        className={cn(
          "rounded-xl border border-border bg-card py-4 shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)]",
          className,
        )}
      >
        <p className="px-4 text-sm text-secondary">
          No results for &ldquo;{results.query}&rdquo;
        </p>
        <button
          type="button"
          onClick={goToAllResults}
          className="mt-3 w-full px-4 text-left text-sm font-medium text-accent hover:underline"
        >
          Search the full catalog
        </button>
      </div>
    );
  }

  const primaryBrand = results.brands[0]?.name;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)]",
        className,
      )}
    >
      {results.watches.length > 0 ? (
        <div className="border-b border-border/80 pb-1">
          <SectionLabel>Matching watches</SectionLabel>
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
          <SectionLabel>Brand matches</SectionLabel>
          {results.brands.map((brand) => (
            <ResultLink
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              title={brand.name}
              subtitle="View brand collection"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}

      {results.categories.length > 0 ? (
        <div className="border-b border-border/80 pb-1">
          <SectionLabel>Categories</SectionLabel>
          {results.categories.map((category) => (
            <ResultLink
              key={category.id}
              href={category.href}
              title={category.label}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={goToAllResults}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-accent transition-colors hover:bg-accent/5"
      >
        <span>
          {primaryBrand
            ? `View all ${primaryBrand} results`
            : "View all results"}
        </span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
