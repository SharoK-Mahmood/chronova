"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { env } from "@/config/env";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useTranslation } from "@/shared/i18n";
import { ApiClientError } from "@/shared/lib/api/client";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account/settings";
  }

  return value;
}

type GoogleSignInButtonProps = {
  /** When true, redirects after success (login/register pages). */
  redirectOnSuccess?: boolean;
};

export function GoogleSignInButton({
  redirectOnSuccess = true,
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!env.googleClientId) {
    return (
      <p className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm text-secondary">
        {t("auth.googleNotConfigured")}
      </p>
    );
  }

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      setError(t("auth.googleFailed"));
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const session = await loginWithGoogle(response.credential);

      if (redirectOnSuccess) {
        const fallback =
          session.user.role === "admin" ? "/admin" : "/account/settings";
        const next = searchParams.get("next");
        router.push(next ? safeNextPath(next) : fallback);
      }
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("auth.googleFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex w-full justify-center overflow-hidden rounded-full [&_iframe]:!w-full">
        <GoogleLogin
          onSuccess={(response) => {
            void handleSuccess(response);
          }}
          onError={() => setError(t("auth.googleFailed"))}
          useOneTap={false}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
          width="384"
        />
      </div>
      {isSubmitting ? (
        <p className="text-center text-sm text-secondary">{t("common.loading")}</p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
