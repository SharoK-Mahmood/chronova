import type { Product } from "@/features/products/types/product.types";
import type {
  NewArrival,
  NewArrivalSpotlight,
} from "@/features/new-arrivals/types/new-arrival.types";

const SPOTLIGHT_SLUG = "land-dweller-40";

const COLLECTION_ENTRIES: Array<{
  slug: string;
  arrivedLabel: string;
  tagline: string;
}> = [
  {
    slug: "day-date-40",
    arrivedLabel: "August 2026",
    tagline: "Platinum prestige, ice-blue dial",
  },
  {
    slug: "sky-dweller",
    arrivedLabel: "August 2026",
    tagline: "Dual time for the modern traveller",
  },
  {
    slug: "lady-datejust-28",
    arrivedLabel: "July 2026",
    tagline: "Everose gold with diamond-set bezel",
  },
  {
    slug: "datejust-31",
    arrivedLabel: "July 2026",
    tagline: "Two-tone elegance for every hour",
  },
  {
    slug: "lumen-28",
    arrivedLabel: "July 2026",
    tagline: "Champagne dial, understated grace",
  },
  {
    slug: "chronova-heritage",
    arrivedLabel: "June 2026",
    tagline: "House collection, timeless appeal",
  },
];

function buildArrival(
  entry: (typeof COLLECTION_ENTRIES)[number],
  products: Product[],
): NewArrival | undefined {
  const product = products.find((item) => item.slug === entry.slug);

  if (!product) {
    return undefined;
  }

  return {
    product,
    arrivedLabel: entry.arrivedLabel,
    tagline: entry.tagline,
  };
}

export function getNewArrivalSpotlight(
  products: Product[],
): NewArrivalSpotlight | undefined {
  const product = products.find((item) => item.slug === SPOTLIGHT_SLUG);

  if (!product) {
    return undefined;
  }

  return {
    product,
    arrivedLabel: "August 2026",
    tagline: "The defining release of the season",
    editorial:
      "A contemporary icon in Oystersteel and white gold — the Land-Dweller 40 arrives with a honeycomb-motif dial and Flat Jubilee bracelet, redefining everyday luxury.",
  };
}

export function getNewArrivalsCollection(products: Product[]): NewArrival[] {
  return COLLECTION_ENTRIES.map((entry) => buildArrival(entry, products)).filter(
    (arrival): arrival is NewArrival => arrival !== undefined,
  );
}

export function getAllNewArrivals(products: Product[]): NewArrival[] {
  const spotlight = getNewArrivalSpotlight(products);

  if (!spotlight) {
    return getNewArrivalsCollection(products);
  }

  return [spotlight, ...getNewArrivalsCollection(products)];
}
