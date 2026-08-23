import type { Metadata } from "next";

import { BrandsPageContent } from "@/features/brands/components/BrandsPageContent";
import { getBrandSummaries } from "@/features/brands";
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
      <BrandsPageContent brands={brands} />
    </Container>
  );
}
