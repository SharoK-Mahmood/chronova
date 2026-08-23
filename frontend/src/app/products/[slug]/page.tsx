import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CATALOG_PRODUCTS, getProductBySlug } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

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
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.subtitle
      ? [
          `${product.brand} ${product.name}`,
          product.subtitle,
          product.reference ? `Reference ${product.reference}` : null,
        ]
          .filter(Boolean)
          .join(". ")
      : `Shop the ${product.name} from Chronova.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div
          className={cn(
            "relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl",
            hasProductPhoto(product.imageUrl)
              ? "bg-white"
              : "border border-border bg-background",
          )}
        >
          {hasProductPhoto(product.imageUrl) ? (
            <Image
              src={product.imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-8"
            />
          ) : (
            <div className="h-40 w-40 rounded-full border border-border bg-card shadow-sm" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent">
              {product.brand}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>
            {product.subtitle ? (
              <p className="mt-2 text-lg text-secondary">{product.subtitle}</p>
            ) : null}
            {product.reference ? (
              <p className="mt-1 text-sm text-secondary">
                Reference {product.reference}
              </p>
            ) : null}
            <p className="mt-3 text-2xl text-accent">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          <p className="text-secondary">{product.description}</p>

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
