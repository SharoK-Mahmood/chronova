import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Sale",
  "Shop discounted watches at Chronova.",
);

export default function SalePage() {
  return (
    <SectionPage
      title="Sale"
      description="Limited-time offers on select Chronova timepieces."
    />
  );
}
