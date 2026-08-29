import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProduct } from "@/features/products";
import { ProductActions } from "@/features/products/components/ProductActions";
import { ProductDetailsPanel } from "@/features/products/components/ProductDetailsPanel";
import { ProductImageGallery } from "@/features/products/components/ProductImageGallery";
import { ProductPrice } from "@/features/products/components/ProductPrice";
import { ApiClientError } from "@/shared/lib/api/client";
import { Container } from "@/shared/components/ui/Container";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

async function loadProduct(slug: string) {
  try {
    return await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null;
    }

    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

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
  const product = await loadProduct(slug);

  if (!product) {
    notFound();
  }

  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : product.name;

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductImageGallery
          imageUrl={product.imageUrl}
          imageUrls={product.imageUrls}
          alt={imageAlt}
        />

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
              <ProductPrice amountUsd={product.price} />
            </p>
          </div>

          <p className="text-secondary">{product.description}</p>

          <ProductActions slug={product.slug} name={product.name} />
        </div>
      </div>

      <ProductDetailsPanel details={product.details} brand={product.brand} />
    </Container>
  );
}
