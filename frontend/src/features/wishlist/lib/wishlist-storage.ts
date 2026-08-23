const WISHLIST_STORAGE_KEY = "chronova-wishlist";

export function readWishlistFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((slug): slug is string => typeof slug === "string");
  } catch {
    return [];
  }
}

export function writeWishlistToStorage(slugs: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
}
