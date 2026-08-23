import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Men",
  "Explore Chronova watches designed for men.",
);

export default function MenPage() {
  return (
    <SectionPage
      title="Men's Watches"
      description="Discover bold, refined timepieces crafted for every occasion."
    />
  );
}
