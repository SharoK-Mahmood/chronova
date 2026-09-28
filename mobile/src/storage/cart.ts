import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredCartEntry = {
  slug: string;
  quantity: number;
  unitPriceUsd?: number;
};

const CART_STORAGE_KEY = "chronova-cart";

export async function readCartFromStorage(): Promise<StoredCartEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
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

export async function writeCartToStorage(
  entries: StoredCartEntry[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore persistence failures (e.g. native module unavailable).
  }
}
