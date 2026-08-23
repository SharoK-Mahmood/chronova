"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { GoogleIcon } from "@/features/auth/components/AuthIcons";
import { cn } from "@/shared/lib/utils/cn";

const GOOGLE_ACCOUNTS = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@gmail.com",
    initial: "J",
  },
  {
    id: "2",
    name: "Chronova Shopper",
    email: "shopper@gmail.com",
    initial: "C",
  },
] as const;

export function GoogleAuthForm() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(GOOGLE_ACCOUNTS[0].id);

  function handleContinue() {
    router.push("/account");
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
          <GoogleIcon className="h-10 w-10" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Sign in with Google
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Choose an account to continue to Chronova
        </p>
      </div>

      <div className="space-y-2">
        {GOOGLE_ACCOUNTS.map((account) => {
          const isSelected = selectedId === account.id;

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => setSelectedId(account.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]",
                isSelected
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/30 hover:bg-background",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-background">
                {account.initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{account.name}</p>
                <p className="truncate text-sm text-secondary">{account.email}</p>
              </div>
              <div
                className={cn(
                  "h-4 w-4 shrink-0 rounded-full border-2",
                  isSelected ? "border-accent bg-accent" : "border-border",
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <AuthButton type="button" className="mt-6 w-full" onClick={handleContinue}>
        Continue
      </AuthButton>

      <p className="mt-6 text-center text-sm text-secondary">
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent/80"
        >
          Use another account
        </Link>
      </p>
    </AuthShell>
  );
}
