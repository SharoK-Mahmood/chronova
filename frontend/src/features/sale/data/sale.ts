import type { Product } from "@/features/products/types/product.types";
import type { SaleItem, SaleSpotlight } from "@/features/sale/types/sale.types";

const SPOTLIGHT_SLUG = "santos-de-cartier-watch";

const SALE_ENTRIES: Array<{
  slug: string;
  salePrice: number;
}> = [
  { slug: "tank-must-de-cartier-watch", salePrice: 2890 },
  { slug: "santos-de-cartier-watch", salePrice: 6990 },
  { slug: "land-dweller-40", salePrice: 14250 },
  { slug: "day-date-40", salePrice: 59800 },
  { slug: "sky-dweller", salePrice: 55900 },
  { slug: "lady-datejust-28", salePrice: 36900 },
  { slug: "datejust-31", salePrice: 12950 },
  { slug: "oyster-perpetual-31", salePrice: 5490 },
];

function buildSaleItem(
  entry: (typeof SALE_ENTRIES)[number],
  products: Product[],
): SaleItem | undefined {
  const product = products.find((item) => item.slug === entry.slug);

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

export function getSaleSpotlight(products: Product[]): SaleSpotlight | undefined {
  const item = buildSaleItem(
    SALE_ENTRIES.find((entry) => entry.slug === SPOTLIGHT_SLUG) ?? {
      slug: SPOTLIGHT_SLUG,
      salePrice: 6990,
    },
    products,
  );

  if (!item) {
    return undefined;
  }

  return {
    ...item,
    headline: "Our most coveted house piece — now at an exceptional value",
  };
}

export function getSaleCollection(products: Product[]): SaleItem[] {
  return SALE_ENTRIES.filter((entry) => entry.slug !== SPOTLIGHT_SLUG)
    .map((entry) => buildSaleItem(entry, products))
    .filter((item): item is SaleItem => item !== undefined);
}

export function getAllSaleItems(products: Product[]): SaleItem[] {
  const spotlight = getSaleSpotlight(products);
  const collection = getSaleCollection(products);

  if (!spotlight) {
    return collection;
  }

  return [spotlight, ...collection];
}

export function getMaxDiscount(products: Product[]): number {
  return Math.max(...getAllSaleItems(products).map((item) => item.discountPercent), 0);
}

export function getTotalSavings(products: Product[]): number {
  return getAllSaleItems(products).reduce((total, item) => total + item.savings, 0);
}
