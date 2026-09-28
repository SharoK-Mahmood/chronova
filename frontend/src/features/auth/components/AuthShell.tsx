"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/shared/components/ui/BrandLogo";
import { useTranslation } from "@/shared/i18n";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label={t("nav.homeAria")}>
            <BrandLogo
              width={220}
              height={60}
              priority
              className="h-10 sm:h-11"
            />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
