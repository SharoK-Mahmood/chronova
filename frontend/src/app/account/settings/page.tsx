import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Account Settings",
  "Manage your Chronova profile and preferences.",
);

export default function AccountSettingsPage() {
  return (
    <SectionPage
      title="Account Settings"
      description="Update your profile, email, and notification preferences."
    />
  );
}
