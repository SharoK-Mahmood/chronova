"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { useAccountSettings } from "@/features/account/context/AccountSettingsProvider";
import { LANGUAGE_OPTIONS } from "@/features/account/constants/settings-nav";
import { getAllOrders } from "@/features/checkout/lib/order-storage";
import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import { CurrencySelector, Price } from "@/features/currency";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { Input } from "@/shared/components/ui/Input";
import type { LanguageCode } from "@/shared/i18n/types";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  en: "en-US",
  ar: "ar-IQ",
  ku: "ckb-IQ",
};

function formatOrderDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AccountSettingsContent() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { settings, isHydrated, updateSettings, setLanguage } =
    useAccountSettings();
  const { activeSection, scrollToSection } = useScrollToSettingsSection();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);

  const shippingAddress = settings.shippingAddress ?? EMPTY_ADDRESS;
  const billingAddress = settings.billingSameAsShipping
    ? shippingAddress
    : (settings.billingAddress ?? EMPTY_ADDRESS);

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  if (!isHydrated) {
    return (
      <Container className="max-w-5xl py-16">
        <p className="text-secondary">{t("account.loadingSettings")}</p>
      </Container>
    );
  }

  function handleLogout() {
    router.push("/login");
  }

  const dateLocale = LOCALE_BY_LANGUAGE[language];

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="max-w-5xl py-10 sm:py-12">
          <SettingsBackLink />
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-accent">
            {t("account.preferences")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("account.settingsTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-background/70">
            {t("account.settingsSubtitle")}
          </p>
        </Container>
      </section>

      <Container className="max-w-5xl py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[12rem_1fr] lg:items-start">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={scrollToSection}
          />

          <div className="space-y-6">
            <SettingsSection
              id="account"
              title={t("account.accountSection.title")}
              description={t("account.accountSection.description")}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="settings-name" className="mb-2 block text-sm font-medium">
                    {t("account.accountSection.name")}
                  </label>
                  <Input
                    id="settings-name"
                    placeholder={t("account.accountSection.namePlaceholder")}
                    value={settings.profile.name}
                    onChange={(event) =>
                      updateSettings({
                        profile: {
                          ...settings.profile,
                          name: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="mb-2 block text-sm font-medium">
                    {t("account.accountSection.email")}
                  </label>
                  <Input
                    id="settings-email"
                    type="email"
                    placeholder={t("account.accountSection.emailPlaceholder")}
                    value={settings.profile.email}
                    onChange={(event) =>
                      updateSettings({
                        profile: {
                          ...settings.profile,
                          email: event.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium">{t("account.accountSection.password")}</p>
                  <p className="mt-0.5 text-xs text-secondary">
                    {t("account.accountSection.passwordDesc")}
                  </p>
                </div>
                <Button href="/reset-password" variant="secondary" className="shrink-0">
                  {t("account.accountSection.changePassword")}
                </Button>
              </div>
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
                    onChange={(shippingAddress) =>
                      updateSettings({ shippingAddress })
                    }
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <label className="mb-5 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.billingSameAsShipping}
                      onChange={(event) =>
                        updateSettings({
                          billingSameAsShipping: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
                    />
                    <span className="text-sm">
                      {t("account.addressesSection.sameAsShipping")}
                    </span>
                  </label>

                  {!settings.billingSameAsShipping ? (
                    <div>
                      <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                        {t("account.addressesSection.billing")}
                      </h3>
                      <AddressForm
                        prefix="billing"
                        value={billingAddress}
                        onChange={(billingAddress) =>
                          updateSettings({ billingAddress })
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
                  <p className="text-sm text-secondary">{t("account.ordersSection.noOrders")}</p>
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
                          {formatOrderDate(order.placedAt, dateLocale)} · {order.lineItems.length}{" "}
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
                  description={t("account.notificationsSection.orderUpdatesDesc")}
                  checked={settings.notifications.emailOrders}
                  onChange={(emailOrders) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        emailOrders,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label={t("account.notificationsSection.promotions")}
                  description={t("account.notificationsSection.promotionsDesc")}
                  checked={settings.notifications.emailPromotions}
                  onChange={(emailPromotions) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        emailPromotions,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label={t("account.notificationsSection.push")}
                  description={t("account.notificationsSection.pushDesc")}
                  checked={settings.notifications.pushNotifications}
                  onChange={(pushNotifications) =>
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
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
                  const isSelected = settings.language === languageOption.code;

                  return (
                    <button
                      key={languageOption.code}
                      type="button"
                      onClick={() => setLanguage(languageOption.code)}
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
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background/50 px-4 py-4">
                <div>
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
                  <span className="text-secondary" aria-hidden>→</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-sm transition-colors hover:border-accent/30 hover:bg-background"
                >
                  <span>{t("account.privacySection.terms")}</span>
                  <span className="text-secondary" aria-hidden>→</span>
                </Link>
                <Link
                  href="/reset-password"
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5 text-sm transition-colors hover:border-accent/30 hover:bg-background"
                >
                  <span>{t("account.accountSection.changePassword")}</span>
                  <span className="text-secondary" aria-hidden>→</span>
                </Link>
              </div>
            </SettingsSection>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
          </div>
        </div>
      </Container>
    </>
  );
}
