import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listProducts } from "@/features/products";
import type { Product } from "@/features/products";
import {
  getAllSaleItems,
  getMaxDiscount,
  getSaleCollection,
  getSaleSpotlight,
  SaleCollection,
  SaleCta,
  SaleHero,
  SaleSpotlightSection,
} from "@/features/sale";

export const metadata: Metadata = {
  title: "Sale",
  description:
    "Shop limited-time offers on select luxury timepieces at Chronova — exceptional watches at exceptional values.",
};

export const dynamic = "force-dynamic";

export default async function SalePage() {
  let products: Product[] = [];

  try {
    products = await listProducts();
  } catch {
    products = [];
  }

  const spotlight = getSaleSpotlight(products);
  const collection = getSaleCollection(products);
  const allItems = getAllSaleItems(products);
  const maxDiscount = getMaxDiscount(products);

  if (!spotlight) {
    notFound();
  }

  return (
    <>
      <SaleHero maxDiscount={maxDiscount} itemCount={allItems.length} />
      <SaleSpotlightSection item={spotlight} />
      <SaleCollection items={collection} />
      <SaleCta />
    </>
  );
}
