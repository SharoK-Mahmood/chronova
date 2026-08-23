import type { LanguageCode } from "@/features/account/types/account-settings.types";

export const LANGUAGES: Record<
  LanguageCode,
  { labelKey: string; nativeLabel: string }
> = {
  en: { labelKey: "account.languageSection.english", nativeLabel: "English" },
  ar: { labelKey: "account.languageSection.arabic", nativeLabel: "العربية" },
  ku: { labelKey: "account.languageSection.kurdish", nativeLabel: "کوردی" },
};

export const LANGUAGE_OPTIONS = (
  Object.keys(LANGUAGES) as LanguageCode[]
).map((code) => ({
  code,
  ...LANGUAGES[code],
}));

export const SETTINGS_NAV_ITEMS = [
  { id: "account", labelKey: "account.settingsNav.account" },
  { id: "addresses", labelKey: "account.settingsNav.addresses" },
  { id: "orders", labelKey: "account.settingsNav.orders" },
  { id: "notifications", labelKey: "account.settingsNav.notifications" },
  { id: "language", labelKey: "account.settingsNav.language" },
  { id: "currency", labelKey: "account.settingsNav.currency" },
  { id: "privacy", labelKey: "account.settingsNav.privacy" },
] as const;
