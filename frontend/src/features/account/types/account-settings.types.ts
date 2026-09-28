import type { CurrencyCode } from "@/features/currency/constants/currency";
import type { RegionalAddress } from "@/shared/lib/address/regional-address";

export type LanguageCode = "en" | "ar" | "ku";

export type ThemeCode = "light" | "dark";

export type SavedAddress = RegionalAddress;

export type NotificationPreferences = {
  emailOrders: boolean;
  emailPromotions: boolean;
  pushNotifications: boolean;
};

export type AccountProfile = {
  name: string;
  email: string;
};

export type AccountSettings = {
  profile: AccountProfile;
  shippingAddress: SavedAddress | null;
  billingAddress: SavedAddress | null;
  billingSameAsShipping: boolean;
  notifications: NotificationPreferences;
  language: LanguageCode;
  currency: CurrencyCode;
  theme: ThemeCode;
};

export type SettingsSectionId =
  | "account"
  | "addresses"
  | "orders"
  | "notifications"
  | "language"
  | "currency"
  | "theme"
  | "privacy";
