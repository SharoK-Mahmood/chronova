import type { Metadata } from "next";

import {
  LegalPageContent,
  PRIVACY_DESCRIPTION,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from "@/features/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: PRIVACY_DESCRIPTION,
};

export default function PrivacyPage() {
  return (
    <LegalPageContent
      variant="privacy"
      description={PRIVACY_DESCRIPTION}
      lastUpdated={PRIVACY_LAST_UPDATED}
      sections={PRIVACY_SECTIONS}
    />
  );
}
