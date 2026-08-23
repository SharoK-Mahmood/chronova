"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { searchCatalogFull } from "@/features/search/lib/search-catalog";
import { Container } from "@/shared/components/ui/Container";

export function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = useMemo(() => searchCatalogFull(query), [query]);

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="max-w-5xl py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Search</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {query ? `Results for “${query}”` : "Search the collection"}
          </h1>
          {query ? (
            <p className="mt-3 text-background/70">
              {results.totalWatchMatches}{" "}
              {results.totalWatchMatches === 1 ? "watch" : "watches"} found
            </p>
          ) : (
            <p className="mt-3 text-background/70">
              Find watches, brands, and categories across Chronova.
            </p>
          )}
        </Container>
      </section>

      <Container className="max-w-5xl py-12 sm:py-16">
        {!query ? (
          <p className="text-secondary">
            Use the search bar above to explore watches, brands, or models.
          </p>
        ) : results.watches.length === 0 &&
          results.brands.length === 0 &&
          results.categories.length === 0 ? (
          <p className="text-secondary">
            No results found. Try another brand, model, or category.
          </p>
        ) : (
          <div className="space-y-10">
            {results.watches.length > 0 ? (
              <section>
                <h2 className="text-xs uppercase tracking-[0.3em] text-accent">
                  Matching watches
                </h2>
                <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
                  {results.watches.map((watch) => (
                    <li key={watch.slug}>
                      <Link
                        href={`/products/${watch.slug}`}
                        className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {watch.brand} {watch.name}
                          </p>
                          {watch.subtitle ? (
                            <p className="mt-1 text-sm text-secondary">
                              {watch.subtitle}
                            </p>
                          ) : null}
                        </div>
                        <span className="text-sm text-accent">View watch →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.brands.length > 0 ? (
              <section>
                <h2 className="text-xs uppercase tracking-[0.3em] text-accent">
                  Brand matches
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {results.brands.map((brand) => (
                    <li key={brand.slug}>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="block rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-accent/30 hover:bg-background"
                      >
                        <p className="font-medium">{brand.name}</p>
                        <p className="mt-1 text-sm text-secondary">
                          View brand collection
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.categories.length > 0 ? (
              <section>
                <h2 className="text-xs uppercase tracking-[0.3em] text-accent">
                  Categories
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {results.categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </Container>
    </>
  );
}
