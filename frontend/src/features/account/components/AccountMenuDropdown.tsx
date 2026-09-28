"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { SETTINGS_NAV_ITEMS } from "@/features/account/constants/settings-nav";
import { useAccountSettings } from "@/features/account/context/AccountSettingsProvider";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { formatUserDisplayName } from "@/features/auth/lib/format-user-name";
import type { SettingsSectionId } from "@/features/account/types/account-settings.types";
import { NavIcon } from "@/shared/components/layout/NavIcon";
import { useTranslation } from "@/shared/i18n";
import { navIconButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";

type AccountMenuDropdownProps = {
  className?: string;
};

export function AccountMenuDropdown({ className }: AccountMenuDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { isHydrated } = useAccountSettings();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const isActive =
    pathname === "/account" || pathname.startsWith("/account/");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleSignOut() {
    setOpen(false);
    logout();
    router.push("/login");
  }

  function goToSection(section: SettingsSectionId) {
    setOpen(false);

    if (pathname === "/account/settings") {
      const nextHash = `#${section}`;
      if (window.location.hash === nextHash) {
        document
          .getElementById(section)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      window.location.hash = section;
      return;
    }

    // Next.js may drop the hash on client navigations — keep a fallback.
    sessionStorage.setItem("chronova.settings-section", section);
    router.push(`/account/settings#${section}`);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("nav.account")}
        title={t("nav.account")}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "relative rounded-full p-2 text-secondary",
          navIconButtonClasses,
          isActive && "bg-background text-accent ring-1 ring-accent/30",
          open && "bg-background text-accent ring-1 ring-accent/30",
        )}
      >
        <NavIcon icon="account" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t("nav.account")}
          className="absolute end-0 top-[calc(100%+0.375rem)] z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)] sm:w-60"
        >
          {isHydrated ? (
            <div className="border-b border-border px-4 py-3">
              {user ? (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    {formatUserDisplayName(user)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-secondary">
                    {user.email}
                  </p>
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-secondary">
                    {t("account.guestTitle")}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-secondary">
                    {t("account.guestSubtitle")}
                  </p>
                </>
              )}
            </div>
          ) : null}

          <ul className="py-1">
            {isAdmin ? (
              <li role="none">
                <Link
                  href="/admin"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-accent transition-colors hover:bg-background"
                >
                  {t("nav.admin")}
                </Link>
              </li>
            ) : null}
            {SETTINGS_NAV_ITEMS.map((item) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => goToSection(item.id)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-secondary transition-colors hover:bg-background hover:text-foreground"
                >
                  {t(item.labelKey)}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-border p-1">
            {user ? (
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-secondary transition-colors hover:bg-background hover:text-foreground"
              >
                {t("auth.signOut")}
              </button>
            ) : (
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-background hover:text-foreground"
              >
                {t("auth.logIn")}
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
