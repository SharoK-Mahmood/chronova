"use client";

import Image from "next/image";
import Link from "next/link";

import { HeaderSearch } from "@/features/search";
import {
  BrandsMegaMenuPanel,
  BrandsMenuProvider,
} from "@/shared/components/layout/BrandsNavMenu";
import {
  MainNavLinks,
  UtilityNavLinks,
} from "@/shared/components/layout/HeaderNav";
import { CurrencySelector } from "@/features/currency";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function Header() {
  const { t } = useTranslation();

  return (
    <BrandsMenuProvider>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
        <Container className="max-w-5xl">
          <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
            <div className="flex min-w-0 items-center gap-6 lg:gap-8">
              <Link href="/" className="shrink-0" aria-label={t("nav.homeAria")}>
                <Image
                  src="/chronova-logo.png"
                  alt={t("site.name")}
                  width={260}
                  height={70}
                  priority
                  className="h-9 w-auto sm:h-10"
                />
              </Link>

              <nav
                aria-label={t("nav.main")}
                className="hidden items-center gap-4 lg:flex xl:gap-5"
              >
                <MainNavLinks variant="desktop" />
              </nav>
            </div>

            <HeaderSearch
              variant="desktop"
              className="hidden min-w-0 flex-1 lg:block lg:max-w-[17rem] xl:max-w-xs"
            />

            <nav
              aria-label={t("nav.utility")}
              className="flex shrink-0 items-center gap-0.5 sm:gap-1"
            >
              <CurrencySelector className="hidden sm:flex" />
              <UtilityNavLinks />
            </nav>
          </div>

          <HeaderSearch variant="mobile" className="pb-3 lg:hidden" />

          <nav
            aria-label={t("nav.main")}
            className="flex items-center gap-4 overflow-x-auto border-t border-border py-2.5 lg:hidden"
          >
            <MainNavLinks variant="mobile" />
            <CurrencySelector className="ml-auto shrink-0 sm:hidden" />
          </nav>
        </Container>

        <BrandsMegaMenuPanel />
      </header>
    </BrandsMenuProvider>
  );
}
