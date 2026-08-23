import { FEATURED_PRODUCTS, ProductGrid } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured watches
            </h2>
            <p className="mt-2 text-foreground/70">
              Curated picks from the Chronova collection.
            </p>
          </div>
          <Button href="/products" variant="secondary">
            View all
          </Button>
        </div>

        <ProductGrid products={FEATURED_PRODUCTS} />
      </Container>
    </section>
  );
}
