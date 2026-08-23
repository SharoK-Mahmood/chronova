import { getProductBySlug } from "@/features/products/data/mock-products";
import type { SaleItem, SaleSpotlight } from "@/features/sale/types/sale.types";

const SPOTLIGHT_SLUG = "chronova-heritage";

const SALE_ENTRIES: Array<{
  slug: string;
  salePrice: number;
}> = [
  { slug: "chronova-minimal", salePrice: 149 },
  { slug: "chronova-classic", salePrice: 199 },
  { slug: "chronova-sport", salePrice: 249 },
  { slug: "chronova-voyager", salePrice: 299 },
  { slug: "chronova-elite", salePrice: 399 },
  { slug: "chronova-heritage", salePrice: 449 },
  { slug: "chronova-pearl", salePrice: 336 },
  { slug: "chronova-grace", salePrice: 439 },
  { slug: "chronova-lumen-28", salePrice: 512 },
  { slug: "oyster-perpetual-31", salePrice: 5490 },
];

function buildSaleItem(
  entry: (typeof SALE_ENTRIES)[number],
): SaleItem | undefined {
  const product = getProductBySlug(entry.slug);

  if (!product) {
    return undefined;
  }

  const originalPrice = product.price;
  const salePrice = entry.salePrice;
  const savings = originalPrice - salePrice;
  const discountPercent = Math.round((savings / originalPrice) * 100);

  return {
    product,
    originalPrice,
    salePrice,
    discountPercent,
    savings,
  };
}

export function getSaleSpotlight(): SaleSpotlight | undefined {
  const item = buildSaleItem(
    SALE_ENTRIES.find((entry) => entry.slug === SPOTLIGHT_SLUG) ?? {
      slug: SPOTLIGHT_SLUG,
      salePrice: 449,
    },
  );

  if (!item) {
    return undefined;
  }

  return {
    ...item,
    headline: "Our most coveted house piece — now at an exceptional value",
  };
}

export function getSaleCollection(): SaleItem[] {
  return SALE_ENTRIES.filter((entry) => entry.slug !== SPOTLIGHT_SLUG)
    .map(buildSaleItem)
    .filter((item): item is SaleItem => item !== undefined);
}

export function getAllSaleItems(): SaleItem[] {
  const spotlight = getSaleSpotlight();
  const collection = getSaleCollection();

  if (!spotlight) {
    return collection;
  }

  return [spotlight, ...collection];
}

export function getMaxDiscount(): number {
  return Math.max(...getAllSaleItems().map((item) => item.discountPercent), 0);
}

export function getTotalSavings(): number {
  return getAllSaleItems().reduce((total, item) => total + item.savings, 0);
}
