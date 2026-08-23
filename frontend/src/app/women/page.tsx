import type { Metadata } from "next";

import { ProductGrid, getProductsByCategory } from "@/features/products";
import { CatalogPageHeader } from "@/shared/components/layout/CatalogPageHeader";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Women",
  description: "Explore Chronova watches designed for women.",
};

export default function WomenPage() {
  const products = getProductsByCategory("women");

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
