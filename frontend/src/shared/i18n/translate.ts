import type { Messages } from "@/shared/i18n/types";
import type { TranslateParams } from "@/shared/i18n/types";

function getNestedValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export type Translator = (key: string, params?: TranslateParams) => string;

export function createTranslator(messages: Messages): Translator {
  return function translate(key: string, params?: TranslateParams): string {
    const value = getNestedValue(messages, key);

    if (typeof value !== "string") {
      return key;
    }

    if (!params) {
      return value;
    }

    return Object.entries(params).reduce(
      (result, [paramKey, paramValue]) =>
        result.replaceAll(`{${paramKey}}`, String(paramValue)),
      value,
    );
  };
}
