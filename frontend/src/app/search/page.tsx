import { Suspense } from "react";

import { SearchResultsContent } from "@/features/search";
import { createSectionMetadata } from "@/shared/components/layout/SectionPage";
import { Container } from "@/shared/components/ui/Container";

export const metadata = createSectionMetadata(
  "Search",
  "Search the Chronova watch collection.",
);

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container className="max-w-5xl py-16">
          <p className="text-secondary">Searching...</p>
        </Container>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
