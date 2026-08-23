import { SITE } from "@/shared/constants/site";
import { Container } from "@/shared/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10 py-8">
      <Container className="flex flex-col gap-2 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p>{SITE.tagline}</p>
      </Container>
    </footer>
  );
}
