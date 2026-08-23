import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "New Arrivals",
  "See the latest watches added to Chronova.",
);

export default function NewArrivalsPage() {
  return (
    <SectionPage
      title="New Arrivals"
      description="Be the first to discover our newest timepieces."
    />
  );
}
