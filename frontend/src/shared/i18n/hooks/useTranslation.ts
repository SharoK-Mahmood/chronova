"use client";

import { useMemo } from "react";

import { useAccountSettings } from "@/features/account/context/AccountSettingsProvider";
import { getMessages } from "@/shared/i18n/get-messages";
import { createTranslator } from "@/shared/i18n/translate";
import type { LanguageCode } from "@/shared/i18n/types";
import type { Messages } from "@/shared/i18n/types";
import type { Translator } from "@/shared/i18n/translate";

export function useTranslation(): {
  t: Translator;
  language: LanguageCode;
  messages: Messages;
} {
  const { settings, isHydrated } = useAccountSettings();
  const language = settings.language;

  const messages = useMemo(() => getMessages(language), [language]);
  const t = useMemo(() => createTranslator(messages), [messages]);

  return { t, language, messages: isHydrated ? messages : getMessages("en") };
}
