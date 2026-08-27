import type { Product } from "@/features/products/types/product.types";
import type { Brand, BrandSummary } from "@/features/brands/types/brand.types";

export const COMMON_BRANDS: Brand[] = [
  {
    name: "Rolex",
    slug: "rolex",
    description:
      "Swiss icons defined by precision, prestige, and enduring design.",
    origin: "Switzerland",
  },
  {
    name: "Omega",
    slug: "omega",
    description:
      "Innovative Swiss watchmaking trusted on land, sea, and in space.",
    origin: "Switzerland",
  },
  {
    name: "Cartier",
    slug: "cartier",
    description:
      "Parisian elegance with sculptural cases and refined proportions.",
    origin: "France",
  },
  {
    name: "TAG Heuer",
    slug: "tag-heuer",
    description:
      "Motorsport heritage and bold chronographs built for performance.",
    origin: "Switzerland",
  },
  {
    name: "Tudor",
    slug: "tudor",
    description:
      "Robust tool watches with Rolex lineage and contemporary character.",
    origin: "Switzerland",
  },
  {
    name: "Breitling",
    slug: "breitling",
    description:
      "Aviation-inspired instruments with bold dials and technical flair.",
    origin: "Switzerland",
  },
  {
    name: "IWC Schaffhausen",
    slug: "iwc",
    description:
      "Engineered classics from pilot chronographs to refined dress pieces.",
    origin: "Switzerland",
  },
  {
    name: "Audemars Piguet",
    slug: "audemars-piguet",
    description:
      "Haute horology with audacious design and meticulous finishing.",
    origin: "Switzerland",
  },
  {
    name: "Patek Philippe",
    slug: "patek-philippe",
    description:
      "The pinnacle of Swiss craftsmanship and generational heirlooms.",
    origin: "Switzerland",
  },
  {
    name: "Chronova",
    slug: "chronova",
    description:
      "The house collection — accessible luxury with Chronova craftsmanship.",
    origin: "Switzerland",
  },
  {
    name: "Seiko",
    slug: "seiko",
    description:
      "Japanese precision with legendary value across sport, dress, and everyday lines.",
    origin: "Japan",
  },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return COMMON_BRANDS.find((brand) => brand.slug === slug);
}

export function getBrandSummaries(products: Product[] = []): BrandSummary[] {
  return COMMON_BRANDS.map((brand) => {
    const brandProducts = products.filter(
      (product) => product.brand.toLowerCase() === brand.name.toLowerCase(),
    );

    return {
      ...brand,
      productCount: brandProducts.length,
      imageUrl: brandProducts[0]?.imageUrl,
    };
  });
}
