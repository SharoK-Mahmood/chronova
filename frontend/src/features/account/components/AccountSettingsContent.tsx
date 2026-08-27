"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  AddressForm,
  EMPTY_ADDRESS,
} from "@/features/account/components/AddressForm";
import {
  SettingsBackLink,
  SettingsNav,
  useScrollToSettingsSection,
} from "@/features/account/components/SettingsNav";
import { SettingsSection } from "@/features/account/components/SettingsSection";
import { SettingsToggle } from "@/features/account/components/SettingsToggle";
import { UnsavedChangesDialog } from "@/features/account/components/UnsavedChangesDialog";
import { useAccountSettings } from "@/features/account/context/AccountSettingsProvider";
import { useUnsavedChangesGuard } from "@/features/account/hooks/useUnsavedChangesGuard";
import { readAccountSettings } from "@/features/account/lib/account-settings-storage";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { formatUserDisplayName } from "@/features/auth/lib/format-user-name";
import { LANGUAGE_OPTIONS } from "@/features/account/constants/settings-nav";
import { listOrders } from "@/features/checkout/services/orders.service";
import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import type {
  AccountSettings,
  LanguageCode,
  NotificationPreferences,
  SavedAddress,
} from "@/features/account/types/account-settings.types";
import type { User } from "@/features/auth/types/auth.types";
import { CurrencySelector, Price } from "@/features/currency";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { ApiClientError } from "@/shared/lib/api/client";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  en: "en-US",
  ar: "ar-IQ",
  ku: "ckb-IQ",
};

type SettingsDraft = {
  profileName: string;
  profileEmail: string;
  shippingAddress: SavedAddress;
  billingAddress: SavedAddress;
  billingSameAsShipping: boolean;
  notifications: NotificationPreferences;
  language: LanguageCode;
};

function formatOrderDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildDraftFromSources(
  settings: AccountSettings,
  user: User | null,
): SettingsDraft {
  return {
    profileName: user
      ? formatUserDisplayName(user)
      : settings.profile.name,
    profileEmail: user?.email ?? settings.profile.email,
    shippingAddress: settings.shippingAddress ?? { ...EMPTY_ADDRESS },
    billingAddress: settings.billingAddress ?? { ...EMPTY_ADDRESS },
    billingSameAsShipping: settings.billingSameAsShipping,
    notifications: { ...settings.notifications },
    language: settings.language,
  };
}

function draftsEqual(a: SettingsDraft, b: SettingsDraft): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function AccountSettingsContent() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { settings, isHydrated, updateSettings, setLanguage } =
    useAccountSettings();
  const {
    user,
    isHydrated: isAuthHydrated,
    updateProfile,
    refreshUser,
    logout,
  } = useAuth();
  const { activeSection, scrollToSection } = useScrollToSettingsSection();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [draft, setDraft] = useState<SettingsDraft | null>(null);
  const [baseline, setBaseline] = useState<SettingsDraft | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const seedGenerationRef = useRef(0);

  useEffect(() => {
    void listOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthHydrated) {
      return;
    }

    const generation = ++seedGenerationRef.current;
    setIsProfileReady(false);

    void (async () => {
      const latestUser = await refreshUser();
      if (generation !== seedGenerationRef.current) {
        return;
      }

      const latestSettings = readAccountSettings();
      const next = buildDraftFromSources(latestSettings, latestUser);
      setDraft(next);
      setBaseline(next);

      if (latestUser) {
        updateSettings({
          profile: {
            name: formatUserDisplayName(latestUser),
            email: latestUser.email,
          },
        });
      }

      setIsProfileReady(true);
    })();
    // Seed once per visit after auth + settings storage are ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount/hydrate seed
  }, [isAuthHydrated, isHydrated]);

  const isDirty = Boolean(
    draft && baseline && !draftsEqual(draft, baseline),
  );
  const { isOpen: isLeaveDialogOpen, requestLeave, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard({ enabled: isDirty });

  if (!isHydrated || !isAuthHydrated || !isProfileReady || !draft || !baseline) {
    return (
      <Container className="max-w-5xl py-16">
        <p className="text-secondary">{t("account.loadingSettings")}</p>
      </Container>
    );
  }

  const shippingAddress = draft.shippingAddress;
  const billingAddress = draft.billingSameAsShipping
    ? draft.shippingAddress
    : draft.billingAddress;
  const dateLocale = LOCALE_BY_LANGUAGE[language];

  function patchDraft(patch: Partial<SettingsDraft>) {
    setSaveSuccess(false);
    setSaveError(null);
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  function handleLogout() {
    requestLeave(() => {
      logout();
      router.push("/login");
    });
  }

  async function handleSaveAll(): Promise<boolean> {
    if (!draft) {
      return false;
    }

    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      let nextName = draft.profileName.trim();
      let nextEmail = draft.profileEmail.trim();

      if (user) {
        const updated = await updateProfile({
          name: nextName,
          email: nextEmail,
        });
        nextName = formatUserDisplayName(updated);
        nextEmail = updated.email;
      }

      updateSettings({
        profile: { name: nextName, email: nextEmail },
        shippingAddress: draft.shippingAddress,
        billingAddress: draft.billingSameAsShipping
          ? null
          : draft.billingAddress,
        billingSameAsShipping: draft.billingSameAsShipping,
        notifications: draft.notifications,
      });
      setLanguage(draft.language);

      const saved = {
        ...draft,
        profileName: nextName,
        profileEmail: nextEmail,
      };
      setDraft(saved);
      setBaseline(saved);
      setSaveSuccess(true);
      return true;
    } catch (cause) {
      setSaveError(
        cause instanceof ApiClientError
          ? cause.message
          : t("account.saveFailed"),
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAndLeave() {
    const saved = await handleSaveAll();
    if (saved) {
      confirmLeave();
    } else {
      cancelLeave();
    }
  }

  return (
    <>
      <UnsavedChangesDialog
        open={isLeaveDialogOpen}
        isSaving={isSaving}
        onSave={() => void handleSaveAndLeave()}
        onLeave={confirmLeave}
        onStay={cancelLeave}
      />
      <section className="border-b border-border bg-primary text-background">
        <Container className="max-w-5xl py-10 sm:py-12">
          <SettingsBackLink />
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-accent">
            {t("account.preferences")}
          </p>
          <h1 className={cn("mt-2", typography.page)}>
            {t("account.settingsTitle")}
          </h1>
          <p className={cn("mt-2 max-w-xl text-background/70", typography.body)}>
            {t("account.settingsSubtitle")}
          </p>
        </Container>
      </section>

      <Container className="max-w-5xl overflow-x-hidden py-8 sm:py-14">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[12rem_1fr] lg:items-start lg:gap-10">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={scrollToSection}
          />

          <div className="min-w-0 space-y-4 sm:space-y-6">
            <SettingsSection
              id="account"
              title={t("account.accountSection.title")}
              description={t("account.accountSection.description")}
            >
              {!user ? (
                <div className="rounded-xl border border-dashed border-border bg-background/40 px-5 py-8 text-center">
                  <p className="text-sm text-secondary">
                    {t("account.accountSection.signInRequired")}
                  </p>
                  <Button href="/login?next=/account/settings" variant="accent" className="mt-4">
                    {t("auth.logIn")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="min-w-0">
                      <label
                        htmlFor="settings-name"
                        className={cn("mb-2 block", typography.label)}
                      >
                        {t("account.accountSection.name")}
                      </label>
                      <Input
                        id="settings-name"
                        placeholder={t("account.accountSection.namePlaceholder")}
                        value={draft.profileName}
                        onChange={(event) =>
                          patchDraft({ profileName: event.target.value })
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <label
                        htmlFor="settings-email"
                        className={cn("mb-2 block", typography.label)}
                      >
                        {t("account.accountSection.email")}
                      </label>
                      <Input
                        id="settings-email"
                        type="email"
                        placeholder={t("account.accountSection.emailPlaceholder")}
                        value={draft.profileEmail}
                        onChange={(event) =>
                          patchDraft({ profileEmail: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-background/50 px-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {t("account.accountSection.password")}
                      </p>
                      <p className="mt-0.5 text-xs text-secondary">
                        {t("account.accountSection.passwordDesc")}
                      </p>
                    </div>
                    <Button
                      href="/reset-password"
                      variant="secondary"
                      className="w-full shrink-0 sm:w-auto"
                    >
                      {t("account.accountSection.changePassword")}
                    </Button>
                  </div>
                </>
              )}
            </SettingsSection>

            <SettingsSection
              id="addresses"
              title={t("account.addressesSection.title")}
              description={t("account.addressesSection.description")}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                    {t("account.addressesSection.shipping")}
                  </h3>
                  <AddressForm
                    prefix="shipping"
                    value={shippingAddress}
                    onChange={(nextShipping) =>
                      patchDraft({ shippingAddress: nextShipping })
                    }
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <label
                    htmlFor="settings-billing-same-as-shipping"
                    className="mb-5 flex cursor-pointer items-center gap-3"
                  >
                    <input
                      id="settings-billing-same-as-shipping"
                      name="billingSameAsShipping"
                      type="checkbox"
                      checked={draft.billingSameAsShipping}
                      onChange={(event) =>
                        patchDraft({
                          billingSameAsShipping: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
                    />
                    <span className="text-sm">
                      {t("account.addressesSection.sameAsShipping")}
                    </span>
                  </label>

                  {!draft.billingSameAsShipping ? (
                    <div>
                      <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                        {t("account.addressesSection.billing")}
                      </h3>
                      <AddressForm
                        prefix="billing"
                        value={billingAddress}
                        onChange={(nextBilling) =>
                          patchDraft({ billingAddress: nextBilling })
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              id="orders"
              title={t("account.ordersSection.title")}
              description={t("account.ordersSection.description")}
            >
              {orders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/40 px-5 py-8 text-center">
                  <p className="text-sm text-secondary">
                    {t("account.ordersSection.noOrders")}
                  </p>
                  <Button href="/products" variant="accent" className="mt-4">
                    {t("common.browseWatches")}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {orders.map((order) => (
                    <li
                      key={order.orderNumber}
                      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="mt-1 text-sm text-secondary">
                          {formatOrderDate(order.placedAt, dateLocale)} ·{" "}
                          {order.lineItems.length}{" "}
                          {order.lineItems.length === 1
                            ? t("common.item")
                            : t("common.items")}
                        </p>
                        <p className="mt-1 text-sm text-accent">
                          <Price amountUsd={order.totalUsd} />
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          href={`/orders/${order.orderNumber}`}
                          variant="secondary"
                          className="text-xs sm:text-sm"
                        >
                          {t("account.ordersSection.trackOrder")}
                        </Button>
                        <Button
                          href={`/checkout/confirmation/${order.orderNumber}`}
                          variant="ghost"
                          className="text-xs sm:text-sm"
                        >
                          {t("account.ordersSection.details")}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SettingsSection>

            <SettingsSection
              id="notifications"
              title={t("account.notificationsSection.title")}
              description={t("account.notificationsSection.description")}
            >
              <div className="space-y-3">
                <SettingsToggle
                  label={t("account.notificationsSection.orderUpdates")}
                  description={t(
                    "account.notificationsSection.orderUpdatesDesc",
                  )}
                  checked={draft.notifications.emailOrders}
                  onChange={(emailOrders) =>
                    patchDraft({
                      notifications: {
                        ...draft.notifications,
                        emailOrders,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label={t("account.notificationsSection.promotions")}
                  description={t(
                    "account.notificationsSection.promotionsDesc",
                  )}
                  checked={draft.notifications.emailPromotions}
                  onChange={(emailPromotions) =>
                    patchDraft({
                      notifications: {
                        ...draft.notifications,
                        emailPromotions,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label={t("account.notificationsSection.push")}
                  description={t("account.notificationsSection.pushDesc")}
                  checked={draft.notifications.pushNotifications}
                  onChange={(pushNotifications) =>
                    patchDraft({
                      notifications: {
                        ...draft.notifications,
                        pushNotifications,
                      },
                    })
                  }
                />
              </div>
            </SettingsSection>

            <SettingsSection
              id="language"
              title={t("account.languageSection.title")}
              description={t("account.languageSection.description")}
            >
              <div className="grid gap-2 sm:grid-cols-3">
                {LANGUAGE_OPTIONS.map((languageOption) => {
                  const isSelected = draft.language === languageOption.code;

                  return (
                    <button
                      key={languageOption.code}
                      type="button"
                      onClick={() =>
                        patchDraft({ language: languageOption.code })
                      }
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-colors",
                        isSelected
                          ? "border-accent bg-accent/8 ring-1 ring-accent/20"
                          : "border-border hover:border-accent/30 hover:bg-background",
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {t(languageOption.labelKey)}
                      </span>
                      <span className="mt-0.5 block text-xs text-secondary">
                        {languageOption.nativeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SettingsSection>

            <SettingsSection
              id="currency"
              title={t("account.currencySection.title")}
              description={t("account.currencySection.description")}
            >
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-background/50 px-3 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t("currency.display")}</p>
                  <p className="mt-0.5 text-xs text-secondary">
                    {t("currency.displayDescription")}
                  </p>
                </div>
                <CurrencySelector />
              </div>
            </SettingsSection>

            <SettingsSection
              id="privacy"
              title={t("account.privacySection.title")}
              description={t("account.privacySection.description")}
            >
              <div className="space-y-3">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-sm transition-colors hover:border-accent/30 hover:bg-background"
                >
                  <span>{t("account.privacySection.privacyPolicy")}</span>
                  <span className="text-secondary" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-sm transition-colors hover:border-accent/30 hover:bg-background"
                >
                  <span>{t("account.privacySection.terms")}</span>
                  <span className="text-secondary" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/reset-password"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-sm transition-colors hover:border-accent/30 hover:bg-background"
                >
                  <span>{t("account.accountSection.changePassword")}</span>
                  <span className="text-secondary" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </SettingsSection>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight">
                {t("account.logoutSection.title")}
              </h2>
              <p className="mt-1 text-sm text-secondary">
                {t("account.logoutSection.description")}
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-5 w-full sm:w-auto"
                onClick={handleLogout}
              >
                {t("auth.logOut")}
              </Button>
            </div>

            <div className="sticky bottom-4 z-10 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {saveError ? (
                    <p className="text-sm text-red-600" role="alert">
                      {saveError}
                    </p>
                  ) : saveSuccess ? (
                    <p className="text-sm text-accent" role="status">
                      {t("account.saveSuccess")}
                    </p>
                  ) : (
                    <p className="text-sm text-secondary">
                      {isDirty
                        ? t("account.unsavedChanges")
                        : t("account.allChangesSaved")}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="accent"
                  className="w-full shrink-0 sm:w-auto"
                  disabled={isSaving || !isDirty}
                  onClick={() => void handleSaveAll()}
                >
                  {isSaving ? t("account.saving") : t("account.saveChanges")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
