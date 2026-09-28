import AsyncStorage from "@react-native-async-storage/async-storage";

const WISHLIST_STORAGE_KEY = "chronova-wishlist";

export async function readWishlistFromStorage(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
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

export async function writeWishlistToStorage(slugs: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Ignore persistence failures (e.g. native module unavailable).
  }
}
