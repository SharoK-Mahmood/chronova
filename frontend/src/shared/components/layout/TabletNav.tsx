"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  MAIN_NAV_LINKS,
  TABLET_PRIMARY_NAV_HREFS,
} from "@/shared/constants/site";
import { BrandsNavLink } from "@/shared/components/layout/BrandsNavMenu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavLinkClassName(isActive: boolean, isHighlighted: boolean) {
  return cn(
    "relative inline-block whitespace-nowrap pb-1 leading-none transition-colors",
    typography.nav,
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

export function TabletPrimaryNavLinks() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const primaryLinks = MAIN_NAV_LINKS.filter((link) =>
    (TABLET_PRIMARY_NAV_HREFS as readonly string[]).includes(link.href),
  );

  return (
    <>
      {primaryLinks.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);
        const isHighlighted = "highlight" in link && link.highlight;
        const label = t(link.labelKey);
        const className = getNavLinkClassName(isActive, isHighlighted);

        if (link.href === "/brands") {
          return (
            <BrandsNavLink
              key={link.href}
              isActive={isActive}
              className={className}
              label={label}
            />
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={className}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
