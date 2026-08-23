import Image from "next/image";
import Link from "next/link";

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

export function Header() {
  return (
    <BrandsMenuProvider>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
        <Container>
          <div className="flex h-20 items-center gap-6 lg:gap-8">
            <Link href="/" className="shrink-0" aria-label="Chronova home">
              <Image
                src="/chronova-logo.png"
                alt="Chronova"
                width={260}
                height={70}
                priority
                className="h-11 w-auto sm:h-12"
              />
            </Link>

            <nav
              aria-label="Main"
              className="hidden flex-1 items-center justify-center gap-5 xl:flex"
            >
              <MainNavLinks variant="desktop" />
            </nav>

            <nav
              aria-label="Utility"
              className="ml-auto flex items-center gap-1 sm:gap-2"
            >
              <CurrencySelector className="hidden sm:flex" />
              <UtilityNavLinks />
            </nav>
          </div>

          <nav
            aria-label="Main"
            className="flex items-center gap-5 overflow-x-auto border-t border-border py-3 xl:hidden"
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
