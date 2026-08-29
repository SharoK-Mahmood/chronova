import type { Metadata } from "next";

import { listProducts } from "@/features/products";
import type { Product } from "@/features/products";
import {
  getNewArrivalSpotlight,
  getNewArrivalsCollection,
  NewArrivalsCollection,
  NewArrivalsCta,
  NewArrivalsHero,
  SpotlightArrival,
} from "@/features/new-arrivals";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Discover the latest luxury timepieces just landed at Chronova — curated for the discerning collector.",
};

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  let products: Product[] = [];

  try {
    products = await listProducts();
  } catch {
    products = [];
  }

  const spotlight = getNewArrivalSpotlight(products);
  const collection = getNewArrivalsCollection(products);

  return (
    <>
      <NewArrivalsHero />
      {spotlight ? <SpotlightArrival arrival={spotlight} /> : null}
      {collection.length > 0 ? (
        <NewArrivalsCollection arrivals={collection} />
      ) : null}
      <NewArrivalsCta />
    </>
  );
}
