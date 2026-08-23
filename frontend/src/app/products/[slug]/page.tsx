import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CATALOG_PRODUCTS } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = CATALOG_PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: `Shop the ${product.name} from Chronova.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = CATALOG_PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex aspect-square items-center justify-center rounded-3xl border border-foreground/10 bg-foreground/[0.03]">
          <div className="h-40 w-40 rounded-full border border-foreground/10 bg-background shadow-sm" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-foreground/50">
              Chronova
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          <p className="text-foreground/70">
            Precision engineering meets timeless design. Built for daily wear
            with premium materials and Chronova craftsmanship.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Add to cart</Button>
            <Button href="/products" variant="secondary">
              Back to shop
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
