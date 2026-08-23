"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_ACCOUNT_SETTINGS,
  readAccountSettings,
  writeAccountSettings,
} from "@/features/account/lib/account-settings-storage";
import type {
  AccountSettings,
  LanguageCode,
} from "@/features/account/types/account-settings.types";

type AccountSettingsContextValue = {
  settings: AccountSettings;
  isHydrated: boolean;
  updateSettings: (patch: Partial<AccountSettings>) => void;
  setLanguage: (language: LanguageCode) => void;
};

const AccountSettingsContext =
  createContext<AccountSettingsContextValue | null>(null);

type AccountSettingsProviderProps = {
  children: ReactNode;
};

export function AccountSettingsProvider({
  children,
}: AccountSettingsProviderProps) {
  const [settings, setSettings] = useState<AccountSettings>(
    DEFAULT_ACCOUNT_SETTINGS,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSettings(readAccountSettings());
    setIsHydrated(true);
  }, []);

  const persist = useCallback((next: AccountSettings) => {
    setSettings(next);
    writeAccountSettings(next);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AccountSettings>) => {
      persist({ ...settings, ...patch });
    },
    [persist, settings],
  );

  const setLanguage = useCallback(
    (language: LanguageCode) => {
      persist({ ...settings, language });
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" || language === "ku" ? "rtl" : "ltr";
    },
    [persist, settings],
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.lang = settings.language;
    document.documentElement.dir =
      settings.language === "ar" || settings.language === "ku" ? "rtl" : "ltr";
  }, [isHydrated, settings.language]);

  const value = useMemo(
    () => ({
      settings,
      isHydrated,
      updateSettings,
      setLanguage,
    }),
    [settings, isHydrated, updateSettings, setLanguage],
  );

  return (
    <AccountSettingsContext.Provider value={value}>
      {children}
    </AccountSettingsContext.Provider>
  );
}

export function useAccountSettings() {
  const context = useContext(AccountSettingsContext);

  if (!context) {
    throw new Error(
      "useAccountSettings must be used within AccountSettingsProvider",
    );
  }

  return context;
}
