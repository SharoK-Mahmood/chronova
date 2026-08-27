import type { Metadata } from "next";

import { ProductGrid, listProducts } from "@/features/products";
import type { Product } from "@/features/products";
import { CatalogPageHeader } from "@/shared/components/layout/CatalogPageHeader";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Women",
  description: "Explore Chronova watches designed for women.",
};

export const dynamic = "force-dynamic";

export default async function WomenPage() {
  let products: Product[] = [];

  try {
    products = await listProducts({ category: "women" });
  } catch {
    products = [];
  }

  return (
    <Container className="py-12 sm:py-16">
      <CatalogPageHeader
        titleKey="catalog.womenTitle"
        descriptionKey="catalog.womenDesc"
        count={products.length}
        emptyKey="catalog.emptyCategory"
      />
      {products.length > 0 ? <ProductGrid products={products} /> : null}
    </Container>
  );
}
