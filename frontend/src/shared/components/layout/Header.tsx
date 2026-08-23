"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import { useCart } from "@/features/cart";
import { HeaderSearch } from "@/features/search";
import { CurrencySelector } from "@/features/currency";
import {
  BrandsMegaMenuPanel,
  BrandsMenuProvider,
} from "@/shared/components/layout/BrandsNavMenu";
import {
  MainNavLinks,
  UtilityNavLinks,
} from "@/shared/components/layout/HeaderNav";
import { MobileMenuDrawer } from "@/shared/components/layout/MobileMenuDrawer";
import { NavIcon } from "@/shared/components/layout/NavIcon";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function MobileCartButton() {
  const { t } = useTranslation();
  const { itemCount, isHydrated, openDrawer } = useCart();
  const showBadge = isHydrated && itemCount > 0;
  const label = t("nav.cart");
  const badgeLabel =
    itemCount === 1
      ? `${label}, 1 ${t("common.item")}`
      : `${label}, ${itemCount} ${t("common.items")}`;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={showBadge ? badgeLabel : label}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-background hover:text-accent"
    >
      <NavIcon icon="cart" className="h-5 w-5" />
      {showBadge ? (
        <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-primary">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <BrandsMenuProvider>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
        {/* Mobile top bar: menu | logo | cart */}
        <Container className="lg:hidden">
          <div className="flex h-14 items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.openMenu")}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-background hover:text-foreground"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <Link
              href="/"
              className="flex min-w-0 flex-1 justify-center"
              aria-label={t("nav.homeAria")}
            >
              <Image
                src="/chronova-logo.png"
                alt={t("site.name")}
                width={220}
                height={60}
                priority
                className="h-8 w-auto"
              />
            </Link>

            <MobileCartButton />
          </div>

          <HeaderSearch variant="mobile" className="pb-3" />
        </Container>

        {/* Desktop header */}
        <Container className="hidden max-w-5xl lg:block">
          <div className="flex h-[4.25rem] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-6 xl:gap-8">
              <Link href="/" className="shrink-0" aria-label={t("nav.homeAria")}>
                <Image
                  src="/chronova-logo.png"
                  alt={t("site.name")}
                  width={260}
                  height={70}
                  priority
                  className="h-10 w-auto"
                />
              </Link>

              <nav
                aria-label={t("nav.main")}
                className="flex items-center gap-4 xl:gap-5"
              >
                <MainNavLinks variant="desktop" />
              </nav>
            </div>

            <HeaderSearch
              variant="desktop"
              className="min-w-0 flex-1 lg:max-w-[17rem] xl:max-w-xs"
            />

            <nav
              aria-label={t("nav.utility")}
              className="flex shrink-0 items-center gap-1"
            >
              <CurrencySelector />
              <UtilityNavLinks />
            </nav>
          </div>
        </Container>

        <BrandsMegaMenuPanel />
      </header>

      <MobileMenuDrawer open={menuOpen} onClose={closeMenu} />
    </BrandsMenuProvider>
  );
}
