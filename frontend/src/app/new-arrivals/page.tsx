import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

export default function NewArrivalsPage() {
  const spotlight = getNewArrivalSpotlight();
  const collection = getNewArrivalsCollection();

  if (!spotlight) {
    notFound();
  }

  return (
    <>
      <NewArrivalsHero />
      <SpotlightArrival arrival={spotlight} />
      <NewArrivalsCollection arrivals={collection} />
      <NewArrivalsCta />
    </>
  );
}
