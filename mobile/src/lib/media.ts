import { apiOrigin } from "@/src/config/env";
import type { Product } from "@/src/types/product";

export function resolveMediaUrl(pathOrUrl: string | undefined | null): string | null {
  if (!pathOrUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${apiOrigin}${path}`;
}

function isAvif(pathOrUrl: string): boolean {
  return /\.avif(?:$|\?)/i.test(pathOrUrl);
}

export function getProductImageUrls(
  product: Pick<Product, "imageUrl" | "imageUrls">,
): string[] {
  // Match website: prefer the gallery list when present.
  const fromGallery = (product.imageUrls ?? []).filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  const candidates =
    fromGallery.length > 0
      ? fromGallery
      : product.imageUrl?.trim()
        ? [product.imageUrl]
        : [];

  const unique = Array.from(new Set(candidates));
  // Prefer non-AVIF when mixed (broader native decoder support); keep AVIF-only galleries.
  const preferred = unique.filter((value) => !isAvif(value));
  const pool = preferred.length > 0 ? preferred : unique;

  return pool
    .map((value) => resolveMediaUrl(value))
    .filter((value): value is string => Boolean(value));
}

/** Prefer JPEG/PNG/WebP — AVIF support is incomplete on some native image stacks. */
export function pickProductImage(
  product: Pick<Product, "imageUrl" | "imageUrls">,
): string | null {
  return getProductImageUrls(product)[0] ?? null;
}

export function hasProductPhoto(imageUrl: string | undefined | null): boolean {
  return Boolean(imageUrl && imageUrl.trim().length > 0);
}
