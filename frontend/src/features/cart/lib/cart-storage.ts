import type { StoredCartEntry } from "@/features/cart/types/cart.types";

const CART_STORAGE_KEY = "chronova-cart";

export function readCartFromStorage(): StoredCartEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry): entry is StoredCartEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as StoredCartEntry).slug === "string" &&
        typeof (entry as StoredCartEntry).quantity === "number" &&
        (entry as StoredCartEntry).quantity > 0,
    );
  } catch {
    return [];
  }
}

export function writeCartToStorage(entries: StoredCartEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
}
