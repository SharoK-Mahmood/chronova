import type { SearchCategory } from "@/features/search/types/search.types";

export const SEARCH_CATEGORIES: SearchCategory[] = [
  {
    id: "watches",
    label: "Watches",
    href: "/products",
    keywords: ["watch", "watches", "collection", "timepiece"],
  },
  {
    id: "men",
    label: "Men",
    href: "/men",
    keywords: ["men", "mens", "men's", "gentleman"],
  },
  {
    id: "women",
    label: "Women",
    href: "/women",
    keywords: ["women", "womens", "women's", "ladies"],
  },
  {
    id: "new-arrivals",
    label: "New Arrivals",
    href: "/new-arrivals",
    keywords: ["new", "arrival", "arrivals", "latest"],
  },
  {
    id: "sale",
    label: "Sale",
    href: "/sale",
    keywords: ["sale", "discount", "offer"],
  },
  {
    id: "brands",
    label: "Brands",
    href: "/brands",
    keywords: ["brand", "brands", "maison"],
  },
];

export function buildSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return "/search";
  }

  return `/search?q=${encodeURIComponent(trimmed)}`;
}
