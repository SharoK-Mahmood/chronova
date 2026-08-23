import type { Product, ProductSummary } from "@/features/products/types/product.types";

const CHRONOVA_DESCRIPTION =
  "Precision engineering meets timeless design. Built for daily wear with premium materials and Chronova craftsmanship.";

const FEATURED_ROLEX: Product[] = [
  {
    id: "rolex-127334",
    name: "Land-Dweller 40",
    slug: "land-dweller-40",
    brand: "Rolex",
    subtitle: "Oyster, 40 mm, Oystersteel and white gold",
    reference: "127334",
    description:
      "The Land-Dweller 40 in Oystersteel and white gold, with an intense white honeycomb-motif dial and a Flat Jubilee bracelet. White Rolesor pairs a white gold fluted bezel with an Oystersteel case in an integrated, contemporary design.",
    price: 16450,
    currency: "USD",
    imageUrl: "/products/land-dweller-40.png",
    category: "men",
    inStock: true,
  },
  {
    id: "rolex-228236",
    name: "Day-Date 40",
    slug: "day-date-40",
    brand: "Rolex",
    subtitle: "Oyster, 40 mm, platinum",
    reference: "228236",
    description:
      "The Oyster Perpetual Day-Date 40 in platinum, with an ice-blue dial, fluted bezel and President bracelet. A flagship Rolex that presents both the day and the date at a glance, in the metal reserved for the brand’s most exclusive models.",
    price: 68800,
    currency: "USD",
    imageUrl: "/products/day-date-40.png",
    category: "men",
    inStock: true,
  },
  {
    id: "rolex-336935",
    name: "Sky-Dweller",
    slug: "sky-dweller",
    brand: "Rolex",
    subtitle: "Oyster, 42 mm, Everose gold",
    reference: "336935",
    description:
      "The Oyster Perpetual Sky-Dweller in 18 kt Everose gold, with a slate dial and Jubilee bracelet. A dual time zone watch with an annual calendar, designed for travellers who need local time and a reference time in a single glance.",
    price: 64900,
    currency: "USD",
    imageUrl: "/products/sky-dweller.png",
    category: "men",
    inStock: true,
  },
];

const CHRONOVA_WATCHES: Product[] = [
  {
    id: "1",
    name: "Chronova Classic",
    slug: "chronova-classic",
    price: 249,
    currency: "USD",
    imageUrl: "/products/classic.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
  {
    id: "2",
    name: "Chronova Sport",
    slug: "chronova-sport",
    price: 329,
    currency: "USD",
    imageUrl: "/products/sport.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
  {
    id: "3",
    name: "Chronova Elite",
    slug: "chronova-elite",
    price: 499,
    currency: "USD",
    imageUrl: "/products/elite.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
  {
    id: "4",
    name: "Chronova Minimal",
    slug: "chronova-minimal",
    price: 199,
    currency: "USD",
    imageUrl: "/products/minimal.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
  {
    id: "5",
    name: "Chronova Heritage",
    slug: "chronova-heritage",
    price: 599,
    currency: "USD",
    imageUrl: "/products/heritage.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
  {
    id: "6",
    name: "Chronova Voyager",
    slug: "chronova-voyager",
    price: 379,
    currency: "USD",
    imageUrl: "/products/voyager.svg",
    brand: "Chronova",
    description: CHRONOVA_DESCRIPTION,
    category: "watches",
    inStock: true,
  },
];

function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
    brand: product.brand,
    reference: product.reference,
    subtitle: product.subtitle,
  };
}

export const FEATURED_PRODUCTS: ProductSummary[] =
  FEATURED_ROLEX.map(toSummary);

export const CATALOG_PRODUCTS: Product[] = [
  ...FEATURED_ROLEX,
  ...CHRONOVA_WATCHES,
];

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((product) => product.slug === slug);
}
