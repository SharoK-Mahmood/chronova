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
};

export type ProductSummary = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "currency" | "imageUrl"
>;
