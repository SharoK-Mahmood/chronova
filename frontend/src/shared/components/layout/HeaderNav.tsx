"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { AccountMenuDropdown } from "@/features/account/components/AccountMenuDropdown";
import { BrandsNavLink } from "@/shared/components/layout/BrandsNavMenu";
import { NavIcon } from "@/shared/components/layout/NavIcon";
import {
  MAIN_NAV_LINKS,
  UTILITY_NAV_LINKS,
} from "@/shared/constants/site";
import { useTranslation } from "@/shared/i18n";
import { navIconButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getMainNavLinkClassName(
  isActive: boolean,
  isHighlighted: boolean,
): string {
  return cn(
    "relative inline-block whitespace-nowrap pb-1 text-[13px] font-normal leading-none transition-all duration-200",
    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent after:transition-transform after:duration-200",
    isActive
      ? "text-foreground after:scale-x-100"
      : cn(
          "text-secondary after:scale-x-0",
          "hover:text-foreground hover:after:scale-x-100",
          isHighlighted && "text-accent hover:text-accent",
        ),
  );
}

type MainNavLinksProps = {
  className?: string;
  variant?: "desktop" | "mobile";
};

export function MainNavLinks({
  className,
  variant = "desktop",
}: MainNavLinksProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {MAIN_NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);
        const isHighlighted = "highlight" in link && link.highlight;
        const linkClassName = cn(
          getMainNavLinkClassName(isActive, isHighlighted),
          className,
        );
        const label = t(link.labelKey);

        if (link.href === "/brands" && variant === "desktop") {
          return (
            <BrandsNavLink
              key={link.href}
              isActive={isActive}
              className={linkClassName}
              label={label}
            />
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={linkClassName}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function UtilityNavLinks() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { count: wishlistCount, isHydrated: wishlistHydrated } = useWishlist();
  const { itemCount: cartCount, isHydrated: cartHydrated, openDrawer } = useCart();

  return (
    <>
      {UTILITY_NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);
        const label = t(link.labelKey);
        const showWishlistCount =
          link.icon === "wishlist" && wishlistHydrated && wishlistCount > 0;
        const showCartCount =
          link.icon === "cart" && cartHydrated && cartCount > 0;
        const badgeCount =
          link.icon === "wishlist"
            ? wishlistCount
            : link.icon === "cart"
              ? cartCount
              : 0;
        const showBadge = showWishlistCount || showCartCount;
        const badgeLabel =
          badgeCount === 1
            ? `${label}, 1 ${t("common.item")}`
            : `${label}, ${badgeCount} ${t("common.items")}`;

        if (link.icon === "cart") {
          return (
            <button
              key={link.href}
              type="button"
              onClick={openDrawer}
              aria-label={showBadge ? badgeLabel : label}
              title={label}
              className={cn(
                "relative rounded-full p-2 text-secondary",
                navIconButtonClasses,
                isActive && "bg-background text-accent ring-1 ring-accent/30",
              )}
            >
              <NavIcon icon={link.icon} />
              {showBadge ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-primary">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              ) : null}
            </button>
          );
        }

        if (link.icon === "account") {
          return <AccountMenuDropdown key={link.href} />;
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={showBadge ? badgeLabel : label}
            aria-current={isActive ? "page" : undefined}
            title={label}
            className={cn(
              "relative rounded-full p-2 text-secondary",
              navIconButtonClasses,
              isActive && "bg-background text-accent ring-1 ring-accent/30",
            )}
          >
            <NavIcon icon={link.icon} />
            {showBadge ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-primary">
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
