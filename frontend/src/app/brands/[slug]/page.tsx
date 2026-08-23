import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrandBySlug, COMMON_BRANDS } from "@/features/brands";
import { getProductsByBrand, ProductGrid } from "@/features/products";
import { Container } from "@/shared/components/ui/Container";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COMMON_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand not found" };
  }

  return {
    title: brand.name,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = getProductsByBrand(brand.name);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-accent">
          {brand.origin}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {brand.name}
        </h1>
        <p className="mt-2 max-w-2xl text-secondary">{brand.description}</p>
        <p className="mt-3 text-sm text-secondary">
          {products.length > 0
            ? `${products.length} ${products.length === 1 ? "watch" : "watches"} available`
            : "No watches available yet"}
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-secondary">
          We&apos;re expanding our {brand.name} collection. Check back soon for
          new arrivals.
        </p>
      )}
    </Container>
  );
}
