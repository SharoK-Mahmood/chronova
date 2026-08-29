import type {
  AccountSettings,
  LanguageCode,
  NotificationPreferences,
  SavedAddress,
} from "@/features/account/types/account-settings.types";
import type { CurrencyCode } from "@/features/currency/constants/currency";
import { apiClient } from "@/shared/lib/api/client";

export type AccountPreferencesPayload = {
  language: LanguageCode;
  currency: CurrencyCode;
  notifications: NotificationPreferences;
  billingSameAsShipping: boolean;
  shippingAddress: SavedAddress | null;
  billingAddress: SavedAddress | null;
};

export async function fetchAccountPreferences(): Promise<AccountPreferencesPayload> {
  const response = await apiClient<{ preferences: AccountPreferencesPayload }>(
    "/auth/me/preferences",
  );
  return response.preferences;
}

export async function saveAccountPreferences(
  input: AccountPreferencesPayload,
): Promise<AccountPreferencesPayload> {
  const response = await apiClient<{ preferences: AccountPreferencesPayload }>(
    "/auth/me/preferences",
    {
      method: "PATCH",
      body: input,
    },
  );
  return response.preferences;
}

export function preferencesToAccountSettings(
  preferences: AccountPreferencesPayload,
  profile: AccountSettings["profile"],
): AccountSettings {
  return {
    profile,
    shippingAddress: preferences.shippingAddress,
    billingAddress: preferences.billingAddress,
    billingSameAsShipping: preferences.billingSameAsShipping,
    notifications: preferences.notifications,
    language: preferences.language,
    currency: preferences.currency,
  };
}

export function accountSettingsToPreferences(
  settings: AccountSettings,
): AccountPreferencesPayload {
  return {
    language: settings.language,
    currency: settings.currency,
    notifications: settings.notifications,
    billingSameAsShipping: settings.billingSameAsShipping,
    shippingAddress: settings.shippingAddress,
    billingAddress: settings.billingSameAsShipping
      ? null
      : settings.billingAddress,
  };
}
