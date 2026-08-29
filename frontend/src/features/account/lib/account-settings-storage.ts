import type {
  AccountProfile,
  AccountSettings,
  LanguageCode,
  SavedAddress,
} from "@/features/account/types/account-settings.types";
import type { CurrencyCode } from "@/features/currency/constants/currency";
import {
  EMPTY_REGIONAL_ADDRESS,
  migrateToRegionalAddress,
  type RegionalAddress,
} from "@/shared/lib/address/regional-address";

const SETTINGS_STORAGE_KEY = "chronova.account-settings";
const SETTINGS_STORAGE_KEY_PREFIX = "chronova.account-settings.";

const DEMO_PROFILE_NAMES = new Set([
  "Jane Doe",
  "Aram Ahmed",
  "jane doe",
  "aram ahmed",
]);

const DEMO_EMAILS = new Set([
  "jane.doe@example.com",
  "aram.ahmed@example.com",
]);

const DEMO_STREET_PATTERNS = [
  /madison/i,
  /new york/i,
  /100 meter/i,
  /128 /,
];

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  profile: {
    name: "",
    email: "",
  },
  shippingAddress: { ...EMPTY_REGIONAL_ADDRESS },
  billingAddress: null,
  billingSameAsShipping: true,
  notifications: {
    emailOrders: true,
    emailPromotions: false,
    pushNotifications: true,
  },
  language: "en",
  currency: "USD",
};

function storageKeyForUser(userId: string | null | undefined): string {
  if (!userId) {
    return SETTINGS_STORAGE_KEY;
  }

  return `${SETTINGS_STORAGE_KEY_PREFIX}${userId}`;
}

function sanitizeProfile(profile: Partial<AccountProfile> | undefined): AccountProfile {
  const name = profile?.name?.trim() ?? "";
  const email = profile?.email?.trim() ?? "";

  return {
    name: DEMO_PROFILE_NAMES.has(name) ? "" : name,
    email: DEMO_EMAILS.has(email.toLowerCase()) ? "" : email,
  };
}

function sanitizeAddress(address: RegionalAddress | null): SavedAddress | null {
  if (!address) {
    return null;
  }

  const streetLooksDemo = DEMO_STREET_PATTERNS.some((pattern) =>
    pattern.test(address.street),
  );
  const nameLooksDemo = DEMO_PROFILE_NAMES.has(address.fullName.trim());

  if (!streetLooksDemo && !nameLooksDemo) {
    return address;
  }

  return {
    ...address,
    fullName: nameLooksDemo ? "" : address.fullName,
    street: streetLooksDemo ? "" : address.street,
    city: streetLooksDemo && address.city === "New York" ? "" : address.city,
    district:
      streetLooksDemo && /ankawa|apt/i.test(address.district)
        ? ""
        : address.district,
    details:
      streetLooksDemo && /floor|apt/i.test(address.details) ? "" : address.details,
    postalCode:
      address.postalCode === "10016" ? "" : address.postalCode,
  };
}

function normalizeAddress(value: unknown): SavedAddress | null {
  const migrated = migrateToRegionalAddress(
    value as Parameters<typeof migrateToRegionalAddress>[0],
  );

  return sanitizeAddress(migrated);
}

function normalizeCurrency(value: unknown): CurrencyCode {
  return value === "IQD" ? "IQD" : "USD";
}

function normalizeLanguage(value: unknown): LanguageCode {
  if (value === "ar" || value === "ku" || value === "en") {
    return value;
  }

  return "en";
}

function parseStoredSettings(raw: string): AccountSettings {
  const parsed = JSON.parse(raw) as Partial<AccountSettings>;
  const shippingAddress =
    normalizeAddress(parsed.shippingAddress) ?? { ...EMPTY_REGIONAL_ADDRESS };

  return {
    ...DEFAULT_ACCOUNT_SETTINGS,
    ...parsed,
    profile: sanitizeProfile(parsed.profile),
    shippingAddress,
    billingAddress: normalizeAddress(parsed.billingAddress),
    notifications: {
      ...DEFAULT_ACCOUNT_SETTINGS.notifications,
      ...parsed.notifications,
    },
    language: normalizeLanguage(parsed.language),
    currency: normalizeCurrency(parsed.currency),
  };
}

export function readAccountSettings(
  userId?: string | null,
): AccountSettings {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNT_SETTINGS;
  }

  try {
    const scopedKey = storageKeyForUser(userId);
    const scopedRaw = window.localStorage.getItem(scopedKey);

    if (scopedRaw) {
      return parseStoredSettings(scopedRaw);
    }

    // Migrate legacy unscoped settings into the user-scoped key once.
    if (userId) {
      const legacyRaw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (legacyRaw) {
        const migrated = parseStoredSettings(legacyRaw);
        writeAccountSettings(migrated, userId);
        return migrated;
      }
    }

    return DEFAULT_ACCOUNT_SETTINGS;
  } catch {
    return DEFAULT_ACCOUNT_SETTINGS;
  }
}

export function writeAccountSettings(
  settings: AccountSettings,
  userId?: string | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    storageKeyForUser(userId),
    JSON.stringify(settings),
  );
}

export function readLanguageFromStorage(
  userId?: string | null,
): LanguageCode {
  return readAccountSettings(userId).language;
}

export function writeLanguageToStorage(
  language: LanguageCode,
  userId?: string | null,
): void {
  const settings = readAccountSettings(userId);
  writeAccountSettings({ ...settings, language }, userId);
}
