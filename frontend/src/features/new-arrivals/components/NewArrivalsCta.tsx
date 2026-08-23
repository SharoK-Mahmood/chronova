import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function NewArrivalsCta() {
  return (
    <section className="border-t border-border bg-primary py-16 text-background sm:py-20">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          Exclusive Access
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Be first to discover what arrives next
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-background/70">
          New pieces land throughout the season. Explore the full catalogue or
          visit our brands to find your next timepiece.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/products" variant="accent">
            Shop all watches
          </Button>
          <Button
            href="/brands"
            variant="secondary"
            className="border-background/20 text-background hover:bg-background/10"
          >
            Explore brands
          </Button>
        </div>
      </Container>
    </section>
  );
}
