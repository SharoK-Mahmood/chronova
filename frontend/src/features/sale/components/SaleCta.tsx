import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function SaleCta() {
  return (
    <section className="border-t border-border bg-primary py-16 text-background sm:py-20">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          Don&apos;t Miss Out
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Offers end when stock runs out
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-background/70">
          Sale prices apply to selected pieces only. Explore the full catalogue
          for pieces not included in this promotion.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href="/products"
            className="bg-accent text-primary hover:bg-accent/90"
          >
            Full catalogue
          </Button>
          <Button
            href="/new-arrivals"
            variant="secondary"
            className="border-background/20 text-background hover:bg-background/10"
          >
            New arrivals
          </Button>
        </div>
      </Container>
    </section>
  );
}
