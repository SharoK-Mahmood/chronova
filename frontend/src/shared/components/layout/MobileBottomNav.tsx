"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { NavIcon } from "@/shared/components/layout/NavIcon";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function CategoriesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { count: wishlistCount, isHydrated: wishlistHydrated } = useWishlist();
  const { itemCount: cartCount, isHydrated: cartHydrated, openDrawer } =
    useCart();

  const items = [
    {
      id: "home",
      href: "/",
      label: t("nav.home"),
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      id: "categories",
      href: "/products",
      label: t("nav.categories"),
      icon: <CategoriesIcon className="h-5 w-5" />,
    },
    {
      id: "wishlist",
      href: "/wishlist",
      label: t("nav.wishlist"),
      icon: <NavIcon icon="wishlist" className="h-5 w-5" />,
      badge: wishlistHydrated && wishlistCount > 0 ? wishlistCount : 0,
    },
    {
      id: "cart",
      href: "/cart",
      label: t("nav.cart"),
      icon: <NavIcon icon="cart" className="h-5 w-5" />,
      badge: cartHydrated && cartCount > 0 ? cartCount : 0,
      isCart: true,
    },
    {
      id: "account",
      href: "/account/settings",
      label: t("nav.account"),
      icon: <NavIcon icon="account" className="h-5 w-5" />,
    },
  ] as const;

  return (
    <nav
      aria-label={t("nav.bottomNav")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md supports-[backdrop-filter]:bg-card/90 md:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {items.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const badge = "badge" in item ? item.badge : 0;
          const className = cn(
            "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 tracking-wide transition-colors",
            typography.nav,
            isActive ? "text-accent" : "text-secondary",
          );

          if ("isCart" in item && item.isCart) {
            return (
              <li key={item.id} className="flex flex-1">
                <button
                  type="button"
                  onClick={openDrawer}
                  aria-label={item.label}
                  className={className}
                >
                  <span className="relative">
                    {item.icon}
                    {badge > 0 ? (
                      <span className="absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-primary">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.id} className="flex flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className={className}
              >
                <span className="relative">
                  {item.icon}
                  {badge > 0 ? (
                    <span className="absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-primary">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ) : null}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
