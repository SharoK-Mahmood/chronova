import type { Product } from "@/src/types/product";

const WATCH_PREVIEW_LIMIT = 5;
const BRAND_PREVIEW_LIMIT = 3;

export type SearchWatchResult = {
  slug: string;
  name: string;
  brand: string;
  subtitle?: string;
};

export type SearchBrandResult = {
  name: string;
  slug: string;
};

export type SearchResults = {
  query: string;
  watches: SearchWatchResult[];
  brands: SearchBrandResult[];
  totalWatchMatches: number;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(value: string | undefined, query: string): boolean {
  if (!value) {
    return false;
  }
  return normalize(value).includes(query);
}

function brandSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function searchCatalog(
  rawQuery: string,
  products: Product[],
): SearchResults {
  const query = normalize(rawQuery);

  if (!query) {
    return {
      query: "",
      watches: [],
      brands: [],
      totalWatchMatches: 0,
    };
  }

  const watchMatches = products.filter(
    (product) =>
      matchesQuery(product.name, query) ||
      matchesQuery(product.brand, query) ||
      matchesQuery(product.subtitle, query) ||
      matchesQuery(product.reference, query) ||
      matchesQuery(product.description, query),
  );

  const brandNames = Array.from(
    new Set(
      products
        .map((product) => product.brand.trim())
        .filter((brand) => matchesQuery(brand, query)),
    ),
  );

  return {
    query,
    watches: watchMatches.slice(0, WATCH_PREVIEW_LIMIT).map((product) => ({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      subtitle: product.subtitle,
    })),
    brands: brandNames.slice(0, BRAND_PREVIEW_LIMIT).map((name) => ({
      name,
      slug: brandSlug(name),
    })),
    totalWatchMatches: watchMatches.length,
  };
}
