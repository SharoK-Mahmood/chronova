export type SearchCategory = {
  id: string;
  label: string;
  href: string;
  keywords: string[];
};

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
  categories: SearchCategory[];
  totalWatchMatches: number;
};
