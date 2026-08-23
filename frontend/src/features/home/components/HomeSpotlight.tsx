import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/features/cart";
import { Price } from "@/features/currency";
import { getProductBySlug } from "@/features/products/data/mock-products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";

export function HomeSpotlight() {
  const product = getProductBySlug("land-dweller-40");

  if (!product) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/5 blur-3xl"
      />

      <Container>
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              Signature piece
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The defining watch of the season
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-secondary">
            An icon reimagined — where contemporary design meets decades of
            horological mastery.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Link
            href={`/products/${product.slug}`}
            className="group relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-white shadow-[0_24px_64px_-24px_rgba(17,17,17,0.2)]">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.name}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
            </div>
            <div className="absolute -left-3 top-8 hidden rounded-full border border-accent/30 bg-card px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-accent shadow-sm lg:block">
              Bestseller
            </div>
          </Link>

          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                {product.brand}
              </p>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {product.name}
              </h3>
              {product.subtitle ? (
                <p className="mt-3 text-lg text-secondary">{product.subtitle}</p>
              ) : null}
            </div>

            <p className="max-w-md text-base leading-relaxed text-secondary">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
              <p className="text-2xl font-semibold text-accent">
                <Price amountUsd={product.price} />
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={`/products/${product.slug}`} effect="luxury">
                  Discover
                </Button>
                <AddToCartButton
                  slug={product.slug}
                  productName={product.name}
                  variant="button"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
