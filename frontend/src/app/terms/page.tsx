import type { Metadata } from "next";

import {
  LegalPageContent,
  TERMS_DESCRIPTION,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/features/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: TERMS_DESCRIPTION,
};

export default function TermsPage() {
  return (
    <LegalPageContent
      variant="terms"
      description={TERMS_DESCRIPTION}
      lastUpdated={TERMS_LAST_UPDATED}
      sections={TERMS_SECTIONS}
    />
  );
}
