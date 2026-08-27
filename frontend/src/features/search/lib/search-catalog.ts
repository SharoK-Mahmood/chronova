import { COMMON_BRANDS } from "@/features/brands/data/brands";
import { SEARCH_CATEGORIES } from "@/features/search/constants/search-categories";
import type { SearchResults } from "@/features/search/types/search.types";
import type { Product } from "@/features/products/types/product.types";

const WATCH_PREVIEW_LIMIT = 5;
const BRAND_PREVIEW_LIMIT = 3;
const CATEGORY_PREVIEW_LIMIT = 3;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(value: string | undefined, query: string): boolean {
  if (!value) {
    return false;
  }

  return normalize(value).includes(query);
}

export function searchCatalog(rawQuery: string, products: Product[]): SearchResults {
  const query = normalize(rawQuery);

  if (!query) {
    return {
      query: "",
      watches: [],
      brands: [],
      categories: [],
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

  const brandMatches = COMMON_BRANDS.filter(
    (brand) =>
      matchesQuery(brand.name, query) ||
      matchesQuery(brand.description, query) ||
      matchesQuery(brand.origin, query),
  );

  const categoryMatches = SEARCH_CATEGORIES.filter(
    (category) =>
      matchesQuery(category.label, query) ||
      category.keywords.some((keyword) => keyword.includes(query)),
  );

  return {
    query,
    watches: watchMatches.slice(0, WATCH_PREVIEW_LIMIT).map((product) => ({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      subtitle: product.subtitle,
    })),
    brands: brandMatches.slice(0, BRAND_PREVIEW_LIMIT).map((brand) => ({
      name: brand.name,
      slug: brand.slug,
    })),
    categories: categoryMatches.slice(0, CATEGORY_PREVIEW_LIMIT),
    totalWatchMatches: watchMatches.length,
  };
}

export function searchCatalogFull(rawQuery: string, products: Product[]): SearchResults {
  const query = normalize(rawQuery);

  if (!query) {
    return {
      query: "",
      watches: [],
      brands: [],
      categories: [],
      totalWatchMatches: 0,
    };
  }

  const preview = searchCatalog(query, products);

  const watchMatches = products.filter(
    (product) =>
      matchesQuery(product.name, query) ||
      matchesQuery(product.brand, query) ||
      matchesQuery(product.subtitle, query) ||
      matchesQuery(product.reference, query) ||
      matchesQuery(product.description, query),
  );

  return {
    ...preview,
    watches: watchMatches.map((product) => ({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      subtitle: product.subtitle,
    })),
    brands: COMMON_BRANDS.filter(
      (brand) =>
        matchesQuery(brand.name, query) ||
        matchesQuery(brand.description, query),
    ).map((brand) => ({
      name: brand.name,
      slug: brand.slug,
    })),
    categories: SEARCH_CATEGORIES.filter(
      (category) =>
        matchesQuery(category.label, query) ||
        category.keywords.some((keyword) => keyword.includes(query)),
    ),
    totalWatchMatches: watchMatches.length,
  };
}
