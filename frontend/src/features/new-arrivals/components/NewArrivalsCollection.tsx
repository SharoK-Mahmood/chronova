import type { NewArrival } from "@/features/new-arrivals/types/new-arrival.types";
import { NewArrivalCard } from "@/features/new-arrivals/components/NewArrivalCard";
import { Container } from "@/shared/components/ui/Container";

type NewArrivalsCollectionProps = {
  arrivals: NewArrival[];
};

export function NewArrivalsCollection({
  arrivals,
}: NewArrivalsCollectionProps) {
  return (
    <section id="collection" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            The Collection
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Freshly curated for the connoisseur
          </h2>
          <p className="mt-4 text-secondary">
            Each piece selected for its craftsmanship, rarity, and presence —
            available now, while stocks last.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {arrivals.map((arrival, index) => (
            <NewArrivalCard
              key={arrival.product.id}
              arrival={arrival}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
