import type {
  AccountProfile,
  AccountSettings,
  LanguageCode,
  SavedAddress,
} from "@/features/account/types/account-settings.types";
import {
  EMPTY_REGIONAL_ADDRESS,
  migrateToRegionalAddress,
  type RegionalAddress,
} from "@/shared/lib/address/regional-address";

const SETTINGS_STORAGE_KEY = "chronova.account-settings";

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
};

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
  const phoneUsesOldPrefix = address.phone.includes("750");

  if (!streetLooksDemo && !nameLooksDemo && !phoneUsesOldPrefix) {
    return address;
  }

  return {
    ...address,
    fullName: nameLooksDemo ? "" : address.fullName,
    phone: phoneUsesOldPrefix ? "" : address.phone,
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

export function readAccountSettings(): AccountSettings {
  if (typeof window === "undefined") {
    return DEFAULT_ACCOUNT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ACCOUNT_SETTINGS;
    }

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
    };
  } catch {
    return DEFAULT_ACCOUNT_SETTINGS;
  }
}

export function writeAccountSettings(settings: AccountSettings): void {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function readLanguageFromStorage(): LanguageCode {
  return readAccountSettings().language;
}

export function writeLanguageToStorage(language: LanguageCode): void {
  const settings = readAccountSettings();
  writeAccountSettings({ ...settings, language });
}
