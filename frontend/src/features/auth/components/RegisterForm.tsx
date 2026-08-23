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

export function RegisterForm() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    router.push("/account");
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-secondary">
          Join Chronova to track orders, save favourites, and more.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              required
            />
          </div>
        </div>

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

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Confirm your password"
        />

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="terms"
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-border text-accent",
              "focus:ring-2 focus:ring-accent/20 focus:ring-offset-0",
            )}
          />
          <span className="text-sm text-secondary">
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:text-accent/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:text-accent/80">
              Privacy Policy
            </Link>
          </span>
        </label>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <AuthButton type="submit" className="w-full">
          Create Account
        </AuthButton>
      </form>

      <AuthDivider />
      <GoogleSignInButton />

      <p className="mt-8 text-center text-sm text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}
