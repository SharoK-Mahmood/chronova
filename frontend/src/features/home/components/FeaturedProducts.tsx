import { FEATURED_PRODUCTS, ProductGrid } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function FeaturedProducts() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-14 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              Curated selection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Featured watches
            </h2>
            <p className="mt-3 max-w-lg text-secondary">
              Handpicked from our collection — exceptional pieces that define
              modern luxury horology.
            </p>
          </div>
          <Button href="/products" variant="secondary" effect="luxury" className="shrink-0">
            View all
          </Button>
        </div>

        <ProductGrid products={FEATURED_PRODUCTS} />
      </Container>
    </section>
  );
}
