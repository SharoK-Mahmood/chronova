import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Brands",
  "Browse watch brands available at Chronova.",
);

export default function BrandsPage() {
  return (
    <SectionPage
      title="Brands"
      description="Shop curated collections from the world's finest watchmakers."
    />
  );
}
