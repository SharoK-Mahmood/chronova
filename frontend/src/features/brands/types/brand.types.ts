export type Brand = {
  name: string;
  slug: string;
  description: string;
  origin: string;
};

export type BrandSummary = Brand & {
  productCount: number;
  imageUrl?: string;
};
