"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

const NAV_ITEMS = [
  { href: "/admin", labelKey: "admin.overview" },
  { href: "/admin/products", labelKey: "admin.products" },
  { href: "/admin/orders", labelKey: "admin.orders" },
] as const;

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary text-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Chronova
            </p>
            <h1 className={cn("text-background", typography.section)}>
              {t("admin.dashboard")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {user ? (
              <span className="hidden text-background/70 sm:inline">
                {user.email}
              </span>
            ) : null}
            <Link href="/" className="text-background/80 hover:text-accent">
              {t("admin.storefront")}
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-background/80 hover:text-accent"
            >
              {t("admin.signOut")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[12rem_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm whitespace-nowrap",
                  isActive
                    ? "bg-accent text-background"
                    : "border border-border bg-card text-secondary hover:text-accent",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
