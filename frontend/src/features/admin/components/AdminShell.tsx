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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Chronova
            </p>
            <h1 className={cn("text-background", typography.section)}>
              {t("admin.dashboard")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {user ? (
              <span className="max-w-[12rem] truncate text-background/70 sm:max-w-none sm:inline">
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

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-[12rem_1fr]">
        <nav className="-mx-4 sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-2 backdrop-blur-sm md:static md:mx-0 md:flex-wrap md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none lg:flex-col lg:flex-nowrap lg:overflow-visible">
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
                  "shrink-0 rounded-full px-3.5 py-2 text-sm whitespace-nowrap sm:px-4",
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
