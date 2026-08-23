import type { LanguageCode } from "@/shared/i18n/types";
import type { Messages } from "@/shared/i18n/types";
import { messages as en } from "@/shared/i18n/messages/en";
import { messages as ar } from "@/shared/i18n/messages/ar";
import { messages as ku } from "@/shared/i18n/messages/ku";

const MESSAGE_CATALOG: Record<LanguageCode, Messages> = {
  en,
  ar,
  ku,
};

export function getMessages(language: LanguageCode): Messages {
  return MESSAGE_CATALOG[language] ?? en;
}

export function getLocaleDir(language: LanguageCode): "ltr" | "rtl" {
  return language === "ar" || language === "ku" ? "rtl" : "ltr";
}
