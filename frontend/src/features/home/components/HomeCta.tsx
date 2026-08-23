import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-primary py-24 text-background sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      <Container className="relative text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">
          The Chronova experience
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Begin your journey into exceptional horology
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-background/65">
          Whether acquiring your first luxury watch or expanding a distinguished
          collection — we are here to guide every step.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row [perspective:1200px]">
          <Button href="/products" effect="luxury" className="px-8 py-3.5 text-base">
            Explore collection
          </Button>
          <Button
            href="/sale"
            variant="secondary"
            effect="luxury"
            className="border-background/25 text-background hover:border-accent/50 hover:bg-background/10 px-8 py-3.5 text-base"
          >
            View sale
          </Button>
        </div>
      </Container>
    </section>
  );
}
