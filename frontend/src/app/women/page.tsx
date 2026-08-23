import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Women",
  "Explore Chronova watches designed for women.",
);

export default function WomenPage() {
  return (
    <SectionPage
      title="Women's Watches"
      description="Elegant designs that complement every style and moment."
    />
  );
}
