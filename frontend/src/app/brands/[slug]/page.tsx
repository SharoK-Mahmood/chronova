import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BrandPageContent,
  COMMON_BRANDS,
  getBrandBySlug,
} from "@/features/brands";
import { getProductsByBrand } from "@/features/products";

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

  return <BrandPageContent brand={brand} products={products} />;
}
