import Link from "next/link";

import { NAV_LINKS, SITE } from "@/shared/constants/site";
import { Container } from "@/shared/components/ui/Container";

export function Header() {
  return (
    <header className="border-b border-foreground/10">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE.name}
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
