"use client";

import { Suspense } from "react";
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

export function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    if (!agreedToTerms) {
      setError(t("auth.agreeTerms"));
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: String(formData.get("email") ?? ""),
        password,
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
      });
      router.push(safeNextPath(searchParams.get("next")));
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("auth.registerFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className={typography.page}>{t("auth.createAccount")}</h1>
        <p className={cn("mt-2 text-secondary", typography.body)}>
          {t("auth.joinChronova")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              {t("auth.firstName")}
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={t("auth.firstNamePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t("auth.lastName")}
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={t("auth.lastNamePlaceholder")}
              required
            />
          </div>
        </div>

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

        <PasswordField
          id="password"
          name="password"
          label={t("auth.password")}
          autoComplete="new-password"
          placeholder={t("auth.passwordPlaceholder")}
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label={t("auth.confirmPassword")}
          autoComplete="new-password"
          placeholder={t("auth.passwordPlaceholder")}
        />

        <label
          htmlFor="register-terms"
          className="flex cursor-pointer items-start gap-3"
        >
          <input
            id="register-terms"
            type="checkbox"
            name="terms"
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-border text-accent",
              "focus:ring-2 focus:ring-accent/20 focus:ring-offset-0",
            )}
          />
          <span className="text-sm text-secondary">{t("auth.agreeTerms")}</span>
        </label>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <AuthButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.createAccount")}
        </AuthButton>
      </form>

      <AuthDivider />
      <Suspense fallback={null}>
        <GoogleSignInButton />
      </Suspense>

      <p className="mt-8 text-center text-sm text-secondary">
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          {t("auth.logIn")}
        </Link>
      </p>
    </AuthShell>
  );
}
