import Link from "next/link";

import { SITE } from "@/shared/constants/site";
import { Container } from "@/shared/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <Container className="flex flex-col gap-4 text-sm text-secondary sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-accent">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-accent">
              Privacy Policy
            </Link>
          </div>
        </div>
        <p>{SITE.tagline}</p>
      </Container>
    </footer>
  );
}
