import type { CurrencyCode } from "@/src/lib/currency";

export type LanguageCode = "en" | "ar" | "ku";
export type ThemeCode = "light" | "dark";

export type SavedAddress = {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  details: string;
};

export type NotificationPreferences = {
  emailOrders: boolean;
  emailPromotions: boolean;
  pushNotifications: boolean;
};

export type AccountPreferences = {
  shippingAddress: SavedAddress;
  billingAddress: SavedAddress;
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

export type PlacedOrderSummary = {
  orderNumber: string;
  placedAt: string;
  totalUsd: number;
  status: string;
  lineItems: Array<{ quantity: number }>;
};

export const EMPTY_ADDRESS: SavedAddress = {
  fullName: "",
  phone: "",
  city: "",
  street: "",
  details: "",
};

export const DEFAULT_PREFERENCES: AccountPreferences = {
  shippingAddress: { ...EMPTY_ADDRESS },
  billingAddress: { ...EMPTY_ADDRESS },
  billingSameAsShipping: true,
  notifications: {
    emailOrders: true,
    emailPromotions: false,
    pushNotifications: true,
  },
  language: "en",
  currency: "USD",
  theme: "light",
};

export const SETTINGS_NAV: Array<{ id: SettingsSectionId; label: string }> = [
  { id: "account", label: "Account" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Orders" },
  { id: "notifications", label: "Notifications" },
  { id: "language", label: "Language" },
  { id: "currency", label: "Currency" },
  { id: "theme", label: "Appearance" },
  { id: "privacy", label: "Privacy & Security" },
];
