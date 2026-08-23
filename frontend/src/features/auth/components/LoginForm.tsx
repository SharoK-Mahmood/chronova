"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/account/settings");
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

        <label className="flex cursor-pointer items-center gap-3">
          <input
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

        <AuthButton type="submit" variant="accent" className="w-full">
          {t("auth.logIn")}
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
