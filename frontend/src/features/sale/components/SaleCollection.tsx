import type { SaleItem } from "@/features/sale/types/sale.types";
import { SaleCard } from "@/features/sale/components/SaleCard";
import { Container } from "@/shared/components/ui/Container";

type SaleCollectionProps = {
  items: SaleItem[];
};

export function SaleCollection({ items }: SaleCollectionProps) {
  return (
    <section id="collection" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            All Deals
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Curated reductions across the collection
          </h2>
          <p className="mt-4 text-secondary">
            From house favourites to select icons — each piece offered at a
            reduced price for a limited period only.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <SaleCard key={item.product.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-secondary">No sale items are available right now.</p>
        )}
      </Container>
    </section>
  );
}
