"use client";

"use client";

import Link from "next/link";

import { SITE } from "@/shared/constants/site";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border py-8">
      <Container className="flex flex-col gap-4 text-sm text-secondary sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {t("site.name")}. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-accent">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-accent">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
        <p>{t("site.tagline")}</p>
      </Container>
    </footer>
  );
}
