import type { Metadata } from "next";

import { ProductGrid, getProductsByCategory } from "@/features/products";
import { CatalogPageHeader } from "@/shared/components/layout/CatalogPageHeader";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Men",
  description: "Explore Chronova watches designed for men.",
};

export default function MenPage() {
  const products = getProductsByCategory("men");

  return (
    <Container className="py-12 sm:py-16">
      <CatalogPageHeader
        titleKey="catalog.menTitle"
        descriptionKey="home.collections.menDesc"
        count={products.length}
        emptyKey="catalog.emptyCategory"
      />
      {products.length > 0 ? <ProductGrid products={products} /> : null}
    </Container>
  );
}
