import { AccountSettingsContent } from "@/features/account";
import { createSectionMetadata } from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Account Settings",
  "Manage your Chronova profile and preferences.",
);

export default function AccountSettingsPage() {
  return <AccountSettingsContent />;
}
