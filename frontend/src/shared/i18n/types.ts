import type { LanguageCode } from "@/features/account/types/account-settings.types";

export type { LanguageCode };

type EnglishMessages = typeof import("@/shared/i18n/messages/en").messages;

type DeepStringRecord<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Messages = DeepStringRecord<EnglishMessages>;

export type MessageKey = string;

export type TranslateParams = Record<string, string | number>;

export type LocaleConfig = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
  dateLocale: string;
};
