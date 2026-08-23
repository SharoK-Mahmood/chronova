export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  brand: string;
  reference?: string;
  subtitle?: string;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "currency"
  | "imageUrl"
  | "brand"
  | "reference"
  | "subtitle"
>;
