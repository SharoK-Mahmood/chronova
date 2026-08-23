import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalDocument,
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
    <LegalDocument
      title="Privacy Policy"
      description={PRIVACY_DESCRIPTION}
      lastUpdated={PRIVACY_LAST_UPDATED}
      sections={PRIVACY_SECTIONS}
      footerNote={
        <>
          See also our{" "}
          <Link href="/terms" className="text-accent hover:text-accent/80">
            Terms of Service
          </Link>
          .
        </>
      }
    />
  );
}
