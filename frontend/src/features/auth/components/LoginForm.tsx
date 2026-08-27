"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { ApiClientError } from "@/shared/lib/api/client";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account/settings";
  }

  return value;
}

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);

    try {
      const session = await login({ email, password });
      const fallback =
        session.user.role === "admin" ? "/admin" : "/account/settings";
      const next = searchParams.get("next");
      router.push(next ? safeNextPath(next) : fallback);
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("auth.loginFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className={typography.page}>{t("auth.welcomeBack")}</h1>
        <p className={cn("mt-2 text-secondary", typography.body)}>
          {t("auth.signInSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("auth.email")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">{t("auth.password")}</span>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <PasswordField id="password" name="password" />
        </div>

        <label
          htmlFor="login-remember"
          className="flex cursor-pointer items-center gap-3"
        >
          <input
            id="login-remember"
            type="checkbox"
            name="remember"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className={cn(
              "h-4 w-4 rounded border-border text-accent",
              "focus:ring-2 focus:ring-accent/20 focus:ring-offset-0",
            )}
          />
          <span className="text-sm text-secondary">{t("auth.rememberMe")}</span>
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <AuthButton
          type="submit"
          variant="accent"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("common.loading") : t("auth.logIn")}
        </AuthButton>
      </form>

      <AuthDivider />
      <GoogleSignInButton />

      <p className="mt-8 text-center text-sm text-secondary">
        {t("auth.noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          {t("auth.createAccount")}
        </Link>
      </p>
    </AuthShell>
  );
}
