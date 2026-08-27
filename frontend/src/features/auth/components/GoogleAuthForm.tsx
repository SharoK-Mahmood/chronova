"use client";

import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { GoogleIcon } from "@/features/auth/components/AuthIcons";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { useTranslation } from "@/shared/i18n";

export function GoogleAuthForm() {
  const { t } = useTranslation();

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
          <GoogleIcon className="h-10 w-10" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("auth.signInGoogle")}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          {t("auth.googleSignInSubtitle")}
        </p>
      </div>

      <Suspense
        fallback={
          <p className="text-center text-sm text-secondary">
            {t("common.loading")}
          </p>
        }
      >
        <GoogleSignInButton />
      </Suspense>

      <p className="mt-6 text-center text-sm text-secondary">
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          {t("auth.backToLogin")}
        </Link>
      </p>
    </AuthShell>
  );
}
