import type { Metadata } from "next";

import { BrandGrid, getBrandSummaries } from "@/features/brands";
import { Container } from "@/shared/components/ui/Container";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Shop curated collections from the world's finest watchmakers at Chronova.",
};

export default function BrandsPage() {
  const brands = getBrandSummaries();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Brands</h1>
        <p className="mt-2 max-w-2xl text-secondary">
          Explore the most sought-after watchmakers — from Swiss icons to the
          Chronova house collection.
        </p>
        <p className="mt-3 text-sm text-secondary">
          {brands.length} {brands.length === 1 ? "brand" : "brands"}
        </p>
      </div>

      <BrandGrid brands={brands} />
    </Container>
  );
}
