import { env } from "@/config/env";

const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|webp|avif|gif)$/i;

const REMOTE_IMAGE_HOSTS = ["images.unsplash.com"];

/** API origin without the `/api` suffix (used for `/uploads/...` media). */
export function getApiOrigin(): string {
  return env.apiUrl.replace(/\/api\/?$/, "");
}

function isLocalApiOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Resolve upload paths for the current API host.
 * - Local API: keep `/uploads/...` so Next rewrites + localPatterns work
 * - Remote API (tunnel/production): absolute URL so the browser can load media
 * - Absolute localhost (or stale host) upload URLs are rewritten to the active API
 */
export function resolveMediaUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        const origin = getApiOrigin();
        if (isLocalApiOrigin(origin)) {
          return `${parsed.pathname}${parsed.search}`;
        }
        if (parsed.origin !== origin) {
          return `${origin}${parsed.pathname}${parsed.search}`;
        }
      }
    } catch {
      // Fall through and return the original URL.
    }
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    const origin = getApiOrigin();
    if (isLocalApiOrigin(origin)) {
      return trimmed;
    }
    return `${origin}${trimmed}`;
  }

  return trimmed;
}

/** True when next/image should skip optimization (remote absolute URLs). */
export function shouldUnoptimizeMedia(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

export function hasProductPhoto(imageUrl: string): boolean {
  if (!imageUrl.trim()) {
    return false;
  }

  if (
    imageUrl.startsWith("/uploads/") ||
    imageUrl.includes("/uploads/") ||
    IMAGE_EXTENSION_PATTERN.test(imageUrl)
  ) {
    return true;
  }

  try {
    const { hostname } = new URL(imageUrl, "http://localhost");
    return REMOTE_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export function getProductImageUrls(product: {
  imageUrl: string;
  imageUrls?: string[] | null;
}): string[] {
  if (product.imageUrls?.length) {
    return product.imageUrls.filter((url) => url.trim().length > 0);
  }

  return product.imageUrl.trim() ? [product.imageUrl] : [];
}
