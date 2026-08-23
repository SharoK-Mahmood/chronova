import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

export default function SalePage() {
  const spotlight = getSaleSpotlight();
  const collection = getSaleCollection();
  const allItems = getAllSaleItems();
  const maxDiscount = getMaxDiscount();

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
