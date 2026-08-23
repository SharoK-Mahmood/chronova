import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { SITE } from "@/shared/constants/site";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-card py-20 sm:py-28">
      <Container className="max-w-3xl text-center sm:text-left">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
          {SITE.tagline}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Discover timepieces crafted for every moment.
        </h1>
        <p className="mt-4 text-lg text-secondary">
          {SITE.description}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center [perspective:1200px]">
          <Button href="/products" effect="luxury" className="px-7 py-3.5 text-base">
            Shop collection
          </Button>
          <Button
            href="/products/land-dweller-40"
            variant="secondary"
            effect="luxury"
            className="px-7 py-3.5 text-base"
          >
            View bestseller
          </Button>
        </div>
      </Container>
    </section>
  );
}
