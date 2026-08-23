import type { Metadata } from "next";

import { ProductGrid, getProductsByCategory } from "@/features/products";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Women",
  description: "Explore Chronova watches designed for women.",
};

export default function WomenPage() {
  const products = getProductsByCategory("women");

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Women&apos;s Watches
        </h1>
        <p className="mt-2 max-w-2xl text-secondary">
          Elegant designs that complement every style and moment.
        </p>
        <p className="mt-3 text-sm text-secondary">
          {products.length} {products.length === 1 ? "watch" : "watches"}
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-secondary">
          No women&apos;s watches are available right now.
        </p>
      )}
    </Container>
  );
}
