import type { Metadata } from "next";

import { BrandsPageContent } from "@/features/brands/components/BrandsPageContent";
import { getBrandSummaries } from "@/features/brands";
import { listProducts } from "@/features/products";
import type { Product } from "@/features/products";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Shop curated collections from the world's finest watchmakers at Chronova.",
};

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  let products: Product[] = [];

  try {
    products = await listProducts();
  } catch {
    products = [];
  }

  const brands = getBrandSummaries(products);

  return (
    <Container className="py-12 sm:py-16">
      <BrandsPageContent brands={brands} />
    </Container>
  );
}
