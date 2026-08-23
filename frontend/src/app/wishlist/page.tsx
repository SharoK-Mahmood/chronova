import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Wishlist",
  "View your saved Chronova watches.",
);

export default function WishlistPage() {
  return (
    <SectionPage
      title="Wishlist"
      description="Your saved watches will appear here."
    />
  );
}
