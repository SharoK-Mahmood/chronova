"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_ACCOUNT_SETTINGS,
  readAccountSettings,
  writeAccountSettings,
} from "@/features/account/lib/account-settings-storage";
import {
  accountSettingsToPreferences,
  fetchAccountPreferences,
  preferencesToAccountSettings,
  saveAccountPreferences,
} from "@/features/account/services/account-preferences.service";
import type {
  AccountSettings,
  LanguageCode,
} from "@/features/account/types/account-settings.types";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { formatUserDisplayName } from "@/features/auth/lib/format-user-name";
import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { EMPTY_REGIONAL_ADDRESS } from "@/shared/lib/address/regional-address";

type AccountSettingsContextValue = {
  settings: AccountSettings;
  isHydrated: boolean;
  updateSettings: (patch: Partial<AccountSettings>) => void;
  replaceSettings: (next: AccountSettings) => void;
  setLanguage: (language: LanguageCode) => void;
  persistPreferences: (next: AccountSettings) => Promise<AccountSettings>;
};

const AccountSettingsContext =
  createContext<AccountSettingsContextValue | null>(null);

type AccountSettingsProviderProps = {
  children: ReactNode;
};

function applyDocumentLanguage(language: LanguageCode) {
  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "ar" || language === "ku" ? "rtl" : "ltr";
}

function withProfileFromUser(
  settings: AccountSettings,
  user: { firstName: string; lastName: string; email: string } | null,
): AccountSettings {
  if (!user) {
    return settings;
  }

  const displayName = formatUserDisplayName(user);
  const shippingAddress = settings.shippingAddress
    ? {
        ...settings.shippingAddress,
        fullName: settings.shippingAddress.fullName.trim() || displayName,
      }
    : {
        ...EMPTY_REGIONAL_ADDRESS,
        fullName: displayName,
      };

  return {
    ...settings,
    profile: {
      name: displayName,
      email: user.email,
    },
    shippingAddress,
  };
}

export function AccountSettingsProvider({
  children,
}: AccountSettingsProviderProps) {
  const { user, isHydrated: isAuthHydrated } = useAuth();
  const { setCurrency } = useCurrency();
  const [settings, setSettings] = useState<AccountSettings>(
    DEFAULT_ACCOUNT_SETTINGS,
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const userIdRef = useRef<string | null>(null);
  const loadGenerationRef = useRef(0);

  userIdRef.current = user?.id ?? null;

  useEffect(() => {
    if (!isAuthHydrated) {
      return;
    }

    const generation = ++loadGenerationRef.current;
    const userId = user?.id ?? null;
    setIsHydrated(false);

    void (async () => {
      let next = readAccountSettings(userId);

      if (user) {
        try {
          const remote = await fetchAccountPreferences();
          next = preferencesToAccountSettings(remote, {
            name: formatUserDisplayName(user),
            email: user.email,
          });
        } catch {
          // Keep local cache when the preferences API is unavailable.
        }

        next = withProfileFromUser(next, user);
      }

      if (generation !== loadGenerationRef.current) {
        return;
      }

      setSettings(next);
      writeAccountSettings(next, userId);
      setCurrency(next.currency);
      applyDocumentLanguage(next.language);
      setIsHydrated(true);
    })();
    // Reload preferences when the signed-in account changes, not on profile refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional user.id scope
  }, [isAuthHydrated, setCurrency, user?.id]);

  const persistLocal = useCallback((next: AccountSettings) => {
    setSettings(next);
    writeAccountSettings(next, userIdRef.current);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AccountSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        writeAccountSettings(next, userIdRef.current);
        return next;
      });
    },
    [],
  );

  const replaceSettings = useCallback(
    (next: AccountSettings) => {
      persistLocal(next);
      setCurrency(next.currency);
      applyDocumentLanguage(next.language);
    },
    [persistLocal, setCurrency],
  );

  const setLanguage = useCallback((language: LanguageCode) => {
    setSettings((prev) => {
      const next = { ...prev, language };
      writeAccountSettings(next, userIdRef.current);
      return next;
    });
    applyDocumentLanguage(language);
  }, []);

  const persistPreferences = useCallback(
    async (next: AccountSettings) => {
      persistLocal(next);
      setCurrency(next.currency);
      applyDocumentLanguage(next.language);

      if (!userIdRef.current) {
        return next;
      }

      const saved = await saveAccountPreferences(
        accountSettingsToPreferences(next),
      );
      const merged = preferencesToAccountSettings(saved, next.profile);
      persistLocal(merged);
      setCurrency(merged.currency);
      applyDocumentLanguage(merged.language);
      return merged;
    },
    [persistLocal, setCurrency],
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    applyDocumentLanguage(settings.language);
  }, [isHydrated, settings.language]);

  const value = useMemo(
    () => ({
      settings,
      isHydrated,
      updateSettings,
      replaceSettings,
      setLanguage,
      persistPreferences,
    }),
    [
      settings,
      isHydrated,
      updateSettings,
      replaceSettings,
      setLanguage,
      persistPreferences,
    ],
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
