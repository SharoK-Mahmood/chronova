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
import { cn } from "@/shared/lib/utils/cn";

export function LoginForm() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/account");
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-sm text-secondary">
          Sign in to access your orders and saved pieces.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Password</span>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
            >
              Forgot Password?
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
          <span className="text-sm text-secondary">Remember me</span>
        </label>

        <AuthButton type="submit" className="w-full">
          Log In
        </AuthButton>
      </form>

      <AuthDivider />
      <GoogleSignInButton />

      <p className="mt-8 text-center text-sm text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}
