import type { Metadata } from "next";

import { CATALOG_PRODUCTS, ProductGrid } from "@/features/products";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Watches",
  description: "Browse the full Chronova watch collection.",
};

export default function ProductsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Watches</h1>
        <p className="mt-2 text-secondary">
          Explore every watch in the Chronova collection.
        </p>
      </div>

      <ProductGrid products={CATALOG_PRODUCTS} />
    </Container>
  );
}
