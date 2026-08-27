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

const FEATURED_WOMEN: Product[] = [
  {
    id: "rolex-279381rbr",
    name: "Lady-Datejust 28",
    slug: "lady-datejust-28",
    brand: "Rolex",
    subtitle: "Oyster, 28 mm, Everose gold and diamonds",
    reference: "279381RBR",
    description:
      "The Lady-Datejust 28 in 18 kt Everose gold with a chocolate dial, diamond-set bezel and President bracelet. A refined expression of Rolex elegance, sized for a slimmer wrist without compromising presence.",
    price: 42800,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
  {
    id: "rolex-278273",
    name: "Datejust 31",
    slug: "datejust-31",
    brand: "Rolex",
    subtitle: "Oyster, 31 mm, Oystersteel and yellow gold",
    reference: "278273",
    description:
      "The Datejust 31 in Oystersteel and yellow gold, with a silver dial, fluted bezel and Jubilee bracelet. A versatile classic that transitions effortlessly from day to evening.",
    price: 15200,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
  {
    id: "rolex-277200",
    name: "Oyster Perpetual 31",
    slug: "oyster-perpetual-31",
    brand: "Rolex",
    subtitle: "Oyster, 31 mm, Oystersteel",
    reference: "277200",
    description:
      "The Oyster Perpetual 31 in Oystersteel with a candy pink dial and Oyster bracelet. Clean, contemporary lines with the reliability of Rolex's perpetual movement in a refined 31 mm case.",
    price: 6100,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
];

const CHRONOVA_WOMEN: Product[] = [
  {
    id: "chronova-lumen-28",
    name: "Lumen 28",
    slug: "lumen-28",
    brand: "Chronova",
    subtitle: "28 mm, champagne dial, leather strap",
    description:
      "A slim 28 mm quartz with a champagne dial and leather strap. Designed for everyday elegance with a lightweight profile that sits comfortably on smaller wrists.",
    price: 640,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
  {
    id: "chronova-pearl",
    name: "Pearl",
    slug: "chronova-pearl",
    brand: "Chronova",
    subtitle: "32 mm, mother-of-pearl dial, rose gold",
    description:
      "The Pearl pairs a luminous mother-of-pearl dial with a rose gold case and mesh bracelet. Soft light play and a refined silhouette for formal and casual wear alike.",
    price: 420,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
  {
    id: "chronova-grace",
    name: "Grace",
    slug: "chronova-grace",
    brand: "Chronova",
    subtitle: "34 mm, automatic, stainless steel",
    description:
      "Grace is a 34 mm automatic with a sunburst silver dial and integrated steel bracelet. Understated movement and a balanced case size for all-day wear.",
    price: 549,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=1200&q=80",
    category: "women",
    inStock: true,
  },
];

const SEIKO_WATCHES: Product[] = [
  {
    id: "seiko-5-sports",
    name: "Seiko 5 Sports",
    slug: "seiko-5-sports",
    brand: "Seiko",
    subtitle: "Automatic, 42.5 mm, stainless steel",
    reference: "SRPD55",
    description:
      "The Seiko 5 Sports combines automatic reliability with a bold dial and unidirectional bezel — an everyday icon of accessible Japanese watchmaking.",
    price: 295,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
    category: "men",
    inStock: true,
  },
  {
    id: "seiko-presage",
    name: "Seiko Presage",
    slug: "seiko-presage",
    brand: "Seiko",
    subtitle: "Automatic, 40.5 mm, cocktail time",
    reference: "SRPB41",
    description:
      "Presage elevates Seiko's mechanical craft with a refined dial inspired by classic cocktails — dress watch elegance with Japanese attention to detail.",
    price: 425,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
    category: "men",
    inStock: true,
  },
  {
    id: "seiko-prospex",
    name: "Seiko Prospex",
    slug: "seiko-prospex",
    brand: "Seiko",
    subtitle: "Automatic diver, 45 mm, ISO certified",
    reference: "SPB143",
    description:
      "Prospex is Seiko's professional sports line — built for divers with ISO-certified water resistance and a heritage of adventure under the sea.",
    price: 1200,
    currency: "USD",
    imageUrl:
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=1200&q=80",
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
  ...FEATURED_WOMEN,
  ...CHRONOVA_WOMEN,
  ...SEIKO_WATCHES,
  ...CHRONOVA_WATCHES,
];

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return CATALOG_PRODUCTS.filter((product) => product.category === category);
}

export function getProductsByBrand(brandName: string): Product[] {
  const normalizedBrand = brandName.toLowerCase();

  return CATALOG_PRODUCTS.filter(
    (product) => product.brand.toLowerCase() === normalizedBrand,
  );
}
