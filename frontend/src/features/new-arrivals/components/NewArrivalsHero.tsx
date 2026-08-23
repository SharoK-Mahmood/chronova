import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function NewArrivalsHero() {
  return (
    <section className="relative overflow-hidden bg-primary text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">
            Just Landed
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            New Arrivals
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
            The latest expressions of horological excellence — curated for those
            who arrive before the world catches on.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="#spotlight"
              variant="accent"
            >
              View spotlight
            </Button>
            <Button
              href="#collection"
              variant="secondary"
              className="border-background/20 text-background hover:bg-background/10"
            >
              Browse collection
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
