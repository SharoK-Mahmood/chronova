import type { ThemeCode } from "@/features/account/types/account-settings.types";

export function applyDocumentTheme(theme: ThemeCode) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function normalizeTheme(value: unknown): ThemeCode {
  return value === "dark" ? "dark" : "light";
}
