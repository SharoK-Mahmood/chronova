import Image from "next/image";
import Link from "next/link";

import {
  MainNavLinks,
  UtilityNavLinks,
} from "@/shared/components/layout/HeaderNav";
import { Container } from "@/shared/components/ui/Container";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
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
            <MainNavLinks />
          </nav>

          <nav
            aria-label="Utility"
            className="ml-auto flex items-center gap-1 sm:gap-2"
          >
            <UtilityNavLinks />
          </nav>
        </div>

        <nav
          aria-label="Main"
          className="flex gap-5 overflow-x-auto border-t border-border py-3 xl:hidden"
        >
          <MainNavLinks />
        </nav>
      </Container>
    </header>
  );
}
