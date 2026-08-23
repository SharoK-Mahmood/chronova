import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalDocument,
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
    <LegalDocument
      title="Terms of Service"
      description={TERMS_DESCRIPTION}
      lastUpdated={TERMS_LAST_UPDATED}
      sections={TERMS_SECTIONS}
      footerNote={
        <>
          See also our{" "}
          <Link href="/privacy" className="text-accent hover:text-accent/80">
            Privacy Policy
          </Link>
          .
        </>
      }
    />
  );
}
