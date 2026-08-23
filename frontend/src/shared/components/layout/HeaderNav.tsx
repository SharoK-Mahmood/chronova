"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandsNavLink } from "@/shared/components/layout/BrandsNavMenu";
import { NavIcon } from "@/shared/components/layout/NavIcon";
import {
  MAIN_NAV_LINKS,
  UTILITY_NAV_LINKS,
} from "@/shared/constants/site";
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
    "relative whitespace-nowrap pb-1 text-sm transition-all duration-200",
    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent after:transition-transform after:duration-200",
    isActive
      ? "font-semibold text-foreground after:scale-x-100"
      : cn(
          "text-secondary after:scale-x-0",
          "hover:font-medium hover:text-foreground hover:after:scale-x-100",
          isHighlighted && "font-medium text-accent hover:text-accent",
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

  return (
    <>
      {MAIN_NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);
        const isHighlighted = "highlight" in link && link.highlight;
        const linkClassName = cn(
          getMainNavLinkClassName(isActive, isHighlighted),
          className,
        );

        if (link.href === "/brands" && variant === "desktop") {
          return (
            <BrandsNavLink
              key={link.href}
              isActive={isActive}
              className={linkClassName}
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
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function UtilityNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {UTILITY_NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.label}
            aria-current={isActive ? "page" : undefined}
            title={link.label}
            className={cn(
              "rounded-full p-2 transition-all duration-200",
              isActive
                ? "bg-background text-accent ring-1 ring-accent/30"
                : "text-secondary hover:bg-background hover:text-accent hover:ring-1 hover:ring-accent/20",
            )}
          >
            <NavIcon icon={link.icon} />
          </Link>
        );
      })}
    </>
  );
}
