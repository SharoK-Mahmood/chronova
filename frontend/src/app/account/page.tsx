import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Account",
  "Manage your Chronova account.",
);

export default function AccountPage() {
  return (
    <SectionPage
      title="Account"
      description="Sign in to manage orders, addresses, and preferences."
    />
  );
}
