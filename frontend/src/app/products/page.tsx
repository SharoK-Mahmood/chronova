import type { Metadata } from "next";

import { CATALOG_PRODUCTS, ProductGrid } from "@/features/products";
import { CatalogPageHeader } from "@/shared/components/layout/CatalogPageHeader";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Watches",
  description: "Browse the full Chronova watch collection.",
};

export default function ProductsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <CatalogPageHeader
        titleKey="catalog.watchesTitle"
        descriptionKey="catalog.watchesDesc"
      />
      <ProductGrid products={CATALOG_PRODUCTS} />
    </Container>
  );
}
