import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Search",
  "Search the Chronova watch collection.",
);

export default function SearchPage() {
  return (
    <SectionPage
      title="Search"
      description="Find your next timepiece across the full Chronova catalog."
    />
  );
}
