"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    setSubmittedEmail(email);
  }

  if (submittedEmail) {
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
                d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("auth.checkEmail")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            {t("auth.checkEmail")}:{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>
          </p>
          <div className="mt-8 space-y-3">
            <AuthButton href="/reset-password" className="w-full">
              {t("auth.resetPassword")}
            </AuthButton>
            <AuthButton
              type="button"
              className="w-full"
              onClick={() => setSubmittedEmail(null)}
            >
              {t("auth.useAnotherAccount")}
            </AuthButton>
            <AuthButton href="/login" variant="secondary" className="w-full">
              {t("auth.backToLogin")}
            </AuthButton>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("auth.forgotPassword")}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          {t("auth.sendResetLink")}
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
            placeholder="you@example.com"
            required
          />
        </div>

        <AuthButton type="submit" className="w-full">
          {t("auth.sendResetLink")}
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-sm text-secondary">
        {t("auth.backToLogin")}{" "}
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
