import type { Product } from "@/features/products/types/product.types";
import type {
  NewArrival,
  NewArrivalSpotlight,
} from "@/features/new-arrivals/types/new-arrival.types";

/** Products remain on New Arrivals for this many days after creation. */
export const NEW_ARRIVAL_WINDOW_DAYS = 60;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function formatArrivedLabel(createdAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

function getTagline(product: Product): string {
  const subtitle = product.subtitle?.trim();
  if (subtitle) {
    return subtitle;
  }

  const description = product.description.trim();
  if (description.length <= 80) {
    return description;
  }

  return `${description.slice(0, 77)}…`;
}

function getEditorial(product: Product): string {
  const description = product.description.trim();
  if (description.length <= 280) {
    return description;
  }

  return `${description.slice(0, 277)}…`;
}

function isWithinNewArrivalWindow(
  product: Product,
  now = Date.now(),
): boolean {
  if (!product.createdAt) {
    return false;
  }

  const createdAt = new Date(product.createdAt).getTime();
  if (Number.isNaN(createdAt)) {
    return false;
  }

  const ageMs = now - createdAt;
  return ageMs >= 0 && ageMs <= NEW_ARRIVAL_WINDOW_DAYS * MS_PER_DAY;
}

function sortByNewest(products: Product[]): Product[] {
  return [...products].sort(
    (left, right) =>
      new Date(right.createdAt!).getTime() -
      new Date(left.createdAt!).getTime(),
  );
}

export function getRecentProducts(products: Product[]): Product[] {
  return sortByNewest(products.filter(isWithinNewArrivalWindow));
}

function toNewArrival(product: Product): NewArrival {
  return {
    product,
    arrivedLabel: formatArrivedLabel(product.createdAt!),
    tagline: getTagline(product),
  };
}

export function getNewArrivalSpotlight(
  products: Product[],
): NewArrivalSpotlight | undefined {
  const newest = getRecentProducts(products)[0];

  if (!newest) {
    return undefined;
  }

  return {
    ...toNewArrival(newest),
    editorial: getEditorial(newest),
  };
}

export function getNewArrivalsCollection(products: Product[]): NewArrival[] {
  return getRecentProducts(products)
    .slice(1)
    .map(toNewArrival);
}

export function getAllNewArrivals(products: Product[]): NewArrival[] {
  return getRecentProducts(products).map(toNewArrival);
}
