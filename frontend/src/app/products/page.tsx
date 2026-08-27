import type { Metadata } from "next";

import { ProductGrid, listProducts } from "@/features/products";
import type { Product } from "@/features/products";
import { CatalogPageHeader } from "@/shared/components/layout/CatalogPageHeader";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Watches",
  description: "Browse the full Chronova watch collection.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    products = await listProducts();
  } catch {
    products = [];
  }

  return (
    <Container className="py-12 sm:py-16">
      <CatalogPageHeader
        titleKey="catalog.watchesTitle"
        descriptionKey="catalog.watchesDesc"
      />
      <ProductGrid products={products} />
    </Container>
  );
}
