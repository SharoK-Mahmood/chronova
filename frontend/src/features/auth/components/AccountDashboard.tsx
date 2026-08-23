"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Container } from "@/shared/components/ui/Container";

export function AccountDashboard() {
  const router = useRouter();

  function handleSignOut() {
    router.push("/login");
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-secondary">
            Manage your orders, wishlist, and account preferences.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/products"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">Orders</p>
              <p className="mt-1 text-sm text-secondary">View your order history</p>
            </Link>
            <Link
              href="/wishlist"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">Wishlist</p>
              <p className="mt-1 text-sm text-secondary">Saved timepieces</p>
            </Link>
            <Link
              href="/cart"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">Cart</p>
              <p className="mt-1 text-sm text-secondary">Review items to purchase</p>
            </Link>
            <Link
              href="/account/settings"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">Settings</p>
              <p className="mt-1 text-sm text-secondary">Profile and preferences</p>
            </Link>
          </div>

          <AuthButton
            type="button"
            variant="secondary"
            className="mt-8 w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </AuthButton>
        </div>
      </div>
    </Container>
  );
}
