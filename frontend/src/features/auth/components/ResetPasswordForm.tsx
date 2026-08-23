"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { useTranslation } from "@/shared/i18n";

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-7 w-7 text-accent"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("auth.passwordUpdated")}
          </h1>
          <p className="mt-3 text-sm text-secondary">
            {t("auth.signInSubtitle")}
          </p>
          <AuthButton href="/login" className="mt-8 w-full">
            {t("auth.logIn")}
          </AuthButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("auth.resetPassword")}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          {t("auth.passwordPlaceholder")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <AuthButton type="submit" className="w-full">
          {t("auth.resetPassword")}
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-sm text-secondary">
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
