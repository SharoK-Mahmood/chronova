import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_PREFERENCES,
  EMPTY_ADDRESS,
  type AccountPreferences,
  type SavedAddress,
} from "@/src/features/account/types";

const STORAGE_KEY = "chronova.account-settings";
const STORAGE_KEY_PREFIX = "chronova.account-settings.";

function storageKey(userId: string | null | undefined): string {
  if (!userId) {
    return STORAGE_KEY;
  }
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function normalizeAddress(value: unknown): SavedAddress {
  if (!value || typeof value !== "object") {
    return { ...EMPTY_ADDRESS };
  }
  const raw = value as Partial<SavedAddress>;
  return {
    fullName: typeof raw.fullName === "string" ? raw.fullName : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    city: typeof raw.city === "string" ? raw.city : "",
    street: typeof raw.street === "string" ? raw.street : "",
    details: typeof raw.details === "string" ? raw.details : "",
  };
}

function normalizePreferences(value: unknown): AccountPreferences {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_PREFERENCES, shippingAddress: { ...EMPTY_ADDRESS }, billingAddress: { ...EMPTY_ADDRESS }, notifications: { ...DEFAULT_PREFERENCES.notifications } };
  }

  const raw = value as Partial<AccountPreferences>;
  return {
    shippingAddress: normalizeAddress(raw.shippingAddress),
    billingAddress: normalizeAddress(raw.billingAddress),
    billingSameAsShipping: raw.billingSameAsShipping !== false,
    notifications: {
      emailOrders: raw.notifications?.emailOrders !== false,
      emailPromotions: Boolean(raw.notifications?.emailPromotions),
      pushNotifications: raw.notifications?.pushNotifications !== false,
    },
    language:
      raw.language === "ar" || raw.language === "ku" || raw.language === "en"
        ? raw.language
        : "en",
    currency: raw.currency === "IQD" ? "IQD" : "USD",
    theme: raw.theme === "dark" ? "dark" : "light",
  };
}

export async function readAccountPreferences(
  userId?: string | null,
): Promise<AccountPreferences> {
  try {
    const stored = await AsyncStorage.getItem(storageKey(userId));
    if (!stored) {
      return normalizePreferences(null);
    }
    return normalizePreferences(JSON.parse(stored));
  } catch {
    return normalizePreferences(null);
  }
}

export async function writeAccountPreferences(
  preferences: AccountPreferences,
  userId?: string | null,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      storageKey(userId),
      JSON.stringify(preferences),
    );
  } catch {
    // Ignore persistence failures.
  }
}
