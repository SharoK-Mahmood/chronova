"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function AccountDashboard() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleSignOut() {
    router.push("/login");
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {t("nav.account")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {t("account.welcome")}
          </h1>
          <p className="mt-2 text-secondary">{t("account.manage")}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/products"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">{t("account.orders")}</p>
              <p className="mt-1 text-sm text-secondary">{t("account.ordersDesc")}</p>
            </Link>
            <Link
              href="/wishlist"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">{t("account.wishlist")}</p>
              <p className="mt-1 text-sm text-secondary">{t("account.wishlistDesc")}</p>
            </Link>
            <Link
              href="/cart"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">{t("account.cart")}</p>
              <p className="mt-1 text-sm text-secondary">{t("account.cartDesc")}</p>
            </Link>
            <Link
              href="/account/settings"
              className="rounded-xl border border-border p-4 transition-all duration-200 hover:scale-[1.01] hover:border-accent/30 hover:shadow-md"
            >
              <p className="font-medium">{t("account.settings")}</p>
              <p className="mt-1 text-sm text-secondary">{t("account.settingsDesc")}</p>
            </Link>
          </div>

          <AuthButton
            type="button"
            variant="secondary"
            className="mt-8 w-full"
            onClick={handleSignOut}
          >
            {t("auth.signOut")}
          </AuthButton>
        </div>
      </div>
    </Container>
  );
}
