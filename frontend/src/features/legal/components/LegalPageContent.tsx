"use client";

import Link from "next/link";

import {
  LegalDocument,
  type LegalSection,
} from "@/features/legal";
import { useTranslation } from "@/shared/i18n";

type LegalPageContentProps = {
  variant: "privacy" | "terms";
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageContent({
  variant,
  description,
  lastUpdated,
  sections,
}: LegalPageContentProps) {
  const { t } = useTranslation();

  const title =
    variant === "privacy" ? t("legal.privacyTitle") : t("legal.termsTitle");
  const footerNote =
    variant === "privacy" ? (
      <>
        {t("legal.seeAlsoTerms")}{" "}
        <Link href="/terms" className="text-accent hover:text-accent/80">
          {t("legal.termsLink")}
        </Link>
        .
      </>
    ) : (
      <>
        {t("legal.seeAlsoPrivacy")}{" "}
        <Link href="/privacy" className="text-accent hover:text-accent/80">
          {t("legal.privacyLink")}
        </Link>
        .
      </>
    );

  return (
    <LegalDocument
      title={title}
      description={description}
      lastUpdated={t("legal.lastUpdated", { date: lastUpdated })}
      sections={sections}
      footerNote={footerNote}
    />
  );
}
