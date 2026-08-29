"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { CurrencySwitch } from "@/features/currency";
import {
  MAIN_NAV_LINKS,
  UTILITY_NAV_LINKS,
} from "@/shared/constants/site";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type MobileMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenuDrawer({ open, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    onClose();
    // Close when navigating to a new page.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only pathname should trigger close
  }, [pathname]);

  const menuLinks = [
    ...MAIN_NAV_LINKS,
    ...UTILITY_NAV_LINKS.filter((link) => link.icon !== "cart"),
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[55] md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={t("nav.closeMenu")}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-primary/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        className={cn(
          "absolute inset-y-0 start-0 flex w-[min(100%,20rem)] flex-col bg-card shadow-2xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <p className="text-sm font-semibold tracking-wide">{t("nav.menu")}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.closeMenu")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-background hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav
          aria-label={t("nav.main")}
          className="flex-1 overflow-y-auto px-2 py-3"
        >
          <ul className="space-y-0.5">
            {menuLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              const isHighlighted = "highlight" in link && link.highlight;
              const href =
                link.href === "/account" ? "/account/settings" : link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                      isActive
                        ? "bg-background text-foreground"
                        : "text-secondary hover:bg-background hover:text-foreground",
                      isHighlighted && !isActive && "text-accent",
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {isAdmin ? (
            <div className="mt-4 border-t border-border px-2 pt-4">
              <Link
                href="/admin"
                aria-current={
                  pathname.startsWith("/admin") ? "page" : undefined
                }
                onClick={onClose}
                className={cn(
                  "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-accent/10 text-accent"
                    : "text-accent hover:bg-background",
                )}
              >
                {t("nav.admin")}
              </Link>
            </div>
          ) : null}
        </nav>

        <div className="border-t border-border px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-secondary">
            {t("currency.display")}
          </p>
          <CurrencySwitch className="w-full" />
        </div>
      </aside>
    </div>
  );
}
