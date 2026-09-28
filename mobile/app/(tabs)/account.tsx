import { Link, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/context/AuthContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { AddressFields } from "@/src/features/account/AddressFields";
import { SettingsSection } from "@/src/features/account/SettingsSection";
import { SettingsToggle } from "@/src/features/account/SettingsToggle";
import {
  readAccountPreferences,
  writeAccountPreferences,
} from "@/src/features/account/storage";
import {
  DEFAULT_PREFERENCES,
  SETTINGS_NAV,
  type AccountPreferences,
  type LanguageCode,
  type PlacedOrderSummary,
  type SettingsSectionId,
  type ThemeCode,
} from "@/src/features/account/types";
import { apiClient } from "@/src/lib/api";
import type { CurrencyCode } from "@/src/lib/currency";
import { colors } from "@/src/theme/colors";

const LANGUAGE_OPTIONS: Array<{
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "ku", label: "Kurdish (Sorani)", nativeLabel: "کوردی" },
];

const THEME_OPTIONS: Array<{
  code: ThemeCode;
  label: string;
  hint: string;
}> = [
  {
    code: "light",
    label: "Light",
    hint: "Bright surfaces and soft neutrals",
  },
  {
    code: "dark",
    label: "Dark",
    hint: "Low-light browsing with gold accents",
  },
];

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountScreen() {
  const { user, isLoading: authLoading, logout, loginWithGoogle } = useAuth();
  const { currency, setCurrency, currencies, format } = useCurrency();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Partial<Record<SettingsSectionId, number>>>({});
  const [heroHeight, setHeroHeight] = useState(0);

  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("account");
  const [prefs, setPrefs] = useState<AccountPreferences>(DEFAULT_PREFERENCES);
  const [prefsReady, setPrefsReady] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [orders, setOrders] = useState<PlacedOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPrefsReady(false);

    void (async () => {
      const stored = await readAccountPreferences(user?.id);
      if (cancelled) {
        return;
      }
      setPrefs(stored);
      setCurrency(stored.currency);
      setPrefsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, setCurrency]);

  useEffect(() => {
    if (user) {
      setProfileName(`${user.firstName} ${user.lastName}`.trim());
      setProfileEmail(user.email);
    } else {
      setProfileName("");
      setProfileEmail("");
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setOrders([]);
      return;
    }

    setOrdersLoading(true);
    void (async () => {
      try {
        const data = await apiClient<PlacedOrderSummary[]>("/orders");
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const displayName = useMemo(() => {
    if (user) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    return profileName;
  }, [user, profileName]);

  function patchPrefs(patch: Partial<AccountPreferences>) {
    setSaveMessage(null);
    setPrefs((current) => ({ ...current, ...patch }));
  }

  function onSectionLayout(id: SettingsSectionId, event: LayoutChangeEvent) {
    sectionOffsets.current[id] = event.nativeEvent.layout.y;
  }

  function scrollToSection(id: SettingsSectionId) {
    setActiveSection(id);
    const relativeY = sectionOffsets.current[id];
    if (typeof relativeY !== "number") {
      return;
    }
    // Section Y inside content ≈ hero + sticky nav block + relative offset.
    // Scroll so the section sits just under the stuck nav.
    scrollRef.current?.scrollTo({
      y: Math.max(heroHeight + relativeY - 4, 0),
      animated: true,
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const next = { ...prefs, currency };
      await writeAccountPreferences(next, user?.id);
      setPrefs(next);
      setSaveMessage("Preferences saved.");
    } catch {
      setSaveMessage("Could not save preferences.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  async function handleGoogleSignIn() {
    setGoogleBusy(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Google Sign-In failed. Please try again.",
      );
    } finally {
      setGoogleBusy(false);
    }
  }

  if (authLoading || !prefsReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading settings…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View
          style={styles.hero}
          onLayout={(event) => setHeroHeight(event.nativeEvent.layout.height)}
        >
          <Text style={styles.heroEyebrow}>Preferences</Text>
          <Text style={styles.heroTitle}>Settings</Text>
          <Text style={styles.heroSubtitle}>
            Manage your profile, addresses, orders, and preferences.
          </Text>
        </View>

        <View style={styles.navSticky}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navRow}
            nestedScrollEnabled
          >
            {SETTINGS_NAV.map((item) => {
              const active = item.id === activeSection;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => scrollToSection(item.id)}
                  style={[styles.navChip, active && styles.navChipActive]}
                >
                  <Text
                    style={[
                      styles.navChipLabel,
                      active && styles.navChipLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sections}>
          <View onLayout={(event) => onSectionLayout("account", event)}>
            <SettingsSection
              title="Account"
              description="Your name, email, and password."
            >
              {!user ? (
                <View style={styles.dashedBox}>
                  <Text style={styles.mutedCenter}>
                    Sign in to view and edit your account details.
                  </Text>
                  {authError ? (
                    <Text style={styles.authError}>{authError}</Text>
                  ) : null}
                  <Button
                    label="Log In"
                    onPress={() => router.push("/login")}
                    style={{ marginTop: 16 }}
                  />
                  <Button
                    label="Create account"
                    variant="secondary"
                    onPress={() => router.push("/register")}
                    style={{ marginTop: 10 }}
                  />
                  <Button
                    label={
                      googleBusy ? "Opening Google…" : "Continue with Google"
                    }
                    variant="secondary"
                    disabled={googleBusy}
                    onPress={() => void handleGoogleSignIn()}
                    style={{ marginTop: 10 }}
                  />
                </View>
              ) : (
                <View style={styles.formStack}>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                      value={profileName}
                      onChangeText={setProfileName}
                      placeholder="Your name"
                      placeholderTextColor={colors.textMuted}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <TextInput
                      value={profileEmail}
                      onChangeText={setProfileEmail}
                      placeholder="you@example.com"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.passwordCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.passwordTitle}>Password</Text>
                      <Text style={styles.muted}>
                        Update your account password securely.
                      </Text>
                    </View>
                    <Text style={styles.comingSoon}>Coming soon</Text>
                  </View>
                  <Text style={styles.signedInAs}>
                    Signed in as {displayName}
                  </Text>
                </View>
              )}
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("addresses", event)}>
            <SettingsSection
              title="Addresses"
              description="Shipping and billing addresses for your orders."
            >
              <Text style={styles.subheading}>Shipping address</Text>
              <AddressFields
                value={prefs.shippingAddress}
                onChange={(shippingAddress) =>
                  patchPrefs({ shippingAddress })
                }
              />

              <Pressable
                style={styles.checkboxRow}
                onPress={() =>
                  patchPrefs({
                    billingSameAsShipping: !prefs.billingSameAsShipping,
                  })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    prefs.billingSameAsShipping && styles.checkboxOn,
                  ]}
                >
                  {prefs.billingSameAsShipping ? (
                    <Text style={styles.checkboxMark}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.checkboxLabel}>
                  Billing address same as shipping
                </Text>
              </Pressable>

              {!prefs.billingSameAsShipping ? (
                <>
                  <Text style={[styles.subheading, { marginTop: 8 }]}>
                    Billing address
                  </Text>
                  <AddressFields
                    value={prefs.billingAddress}
                    onChange={(billingAddress) =>
                      patchPrefs({ billingAddress })
                    }
                  />
                </>
              ) : null}
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("orders", event)}>
            <SettingsSection
              title="Orders"
              description="Order history and tracking."
            >
              {!user ? (
                <View style={styles.dashedBox}>
                  <Text style={styles.mutedCenter}>
                    Sign in to view your order history.
                  </Text>
                  <Button
                    label="Log In"
                    onPress={() => router.push("/login")}
                    style={{ marginTop: 16 }}
                  />
                </View>
              ) : ordersLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : orders.length === 0 ? (
                <View style={styles.dashedBox}>
                  <Text style={styles.mutedCenter}>No orders yet.</Text>
                  <Button
                    label="Browse watches"
                    onPress={() => router.push("/products")}
                    style={{ marginTop: 16 }}
                  />
                </View>
              ) : (
                <View style={styles.orderList}>
                  {orders.map((order) => {
                    const itemCount = order.lineItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    );
                    return (
                      <View key={order.orderNumber} style={styles.orderRow}>
                        <Text style={styles.orderNumber}>
                          {order.orderNumber}
                        </Text>
                        <Text style={styles.muted}>
                          {formatOrderDate(order.placedAt)} · {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"}
                        </Text>
                        <Text style={styles.orderTotal}>
                          {format(order.totalUsd)}
                        </Text>
                        <Text style={styles.orderStatus}>{order.status}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("notifications", event)}>
            <SettingsSection
              title="Notifications"
              description="Choose how you'd like to hear from Chronova."
            >
              <View style={styles.toggleStack}>
                <SettingsToggle
                  label="Order updates"
                  description="Email confirmations, shipping, and delivery alerts."
                  checked={prefs.notifications.emailOrders}
                  onChange={(emailOrders) =>
                    patchPrefs({
                      notifications: {
                        ...prefs.notifications,
                        emailOrders,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label="Promotions & new arrivals"
                  description="Curated edits, private sales, and collection launches."
                  checked={prefs.notifications.emailPromotions}
                  onChange={(emailPromotions) =>
                    patchPrefs({
                      notifications: {
                        ...prefs.notifications,
                        emailPromotions,
                      },
                    })
                  }
                />
                <SettingsToggle
                  label="Order status alerts"
                  description="In-app notifications when your order is processing, shipped, or delivered."
                  checked={prefs.notifications.pushNotifications}
                  onChange={(pushNotifications) =>
                    patchPrefs({
                      notifications: {
                        ...prefs.notifications,
                        pushNotifications,
                      },
                    })
                  }
                />
              </View>
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("language", event)}>
            <SettingsSection
              title="Language"
              description="Select your preferred language."
            >
              <View style={styles.optionGrid}>
                {LANGUAGE_OPTIONS.map((option) => {
                  const selected = prefs.language === option.code;
                  return (
                    <Pressable
                      key={option.code}
                      onPress={() => patchPrefs({ language: option.code })}
                      style={[
                        styles.optionCard,
                        selected && styles.optionCardActive,
                      ]}
                    >
                      <Text style={styles.optionTitle}>{option.label}</Text>
                      <Text style={styles.optionHint}>
                        {option.nativeLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("currency", event)}>
            <SettingsSection
              title="Currency"
              description="Choose how prices are displayed across Chronova."
            >
              <View style={styles.currencyCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passwordTitle}>Display currency</Text>
                  <Text style={styles.muted}>
                    Prices convert using a fixed display rate.
                  </Text>
                </View>
              </View>
              <View style={styles.optionGrid}>
                {(Object.keys(currencies) as CurrencyCode[]).map((code) => {
                  const selected = currency === code;
                  return (
                    <Pressable
                      key={code}
                      onPress={() => {
                        setCurrency(code);
                        patchPrefs({ currency: code });
                      }}
                      style={[
                        styles.optionCard,
                        selected && styles.optionCardActive,
                      ]}
                    >
                      <Text style={styles.optionTitle}>{code}</Text>
                      <Text style={styles.optionHint}>
                        {currencies[code].label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("theme", event)}>
            <SettingsSection
              title="Appearance"
              description="Choose a light or dark look for Chronova."
            >
              <View style={styles.optionGrid}>
                {THEME_OPTIONS.map((option) => {
                  const selected = prefs.theme === option.code;
                  return (
                    <Pressable
                      key={option.code}
                      onPress={() => patchPrefs({ theme: option.code })}
                      style={[
                        styles.optionCard,
                        selected && styles.optionCardActive,
                      ]}
                    >
                      <Text style={styles.optionTitle}>{option.label}</Text>
                      <Text style={styles.optionHint}>{option.hint}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </SettingsSection>
          </View>

          <View onLayout={(event) => onSectionLayout("privacy", event)}>
            <SettingsSection
              title="Privacy & Security"
              description="Your data and account security."
            >
              <View style={styles.linkList}>
                <View style={styles.linkRow}>
                  <Text style={styles.linkRowLabel}>Privacy policy</Text>
                  <Text style={styles.linkRowArrow}>→</Text>
                </View>
                <View style={styles.linkRow}>
                  <Text style={styles.linkRowLabel}>Terms of service</Text>
                  <Text style={styles.linkRowArrow}>→</Text>
                </View>
              </View>
            </SettingsSection>
          </View>

          {user ? (
            <View style={styles.logoutCard}>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.muted}>
                Sign out of your Chronova account on this device.
              </Text>
              <Button
                label="Log out"
                variant="secondary"
                onPress={() => void handleLogout()}
                style={{ marginTop: 16 }}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.saveBar}>
        <Text style={styles.saveHint}>
          {saveMessage ?? "Save preferences to keep them on this device."}
        </Text>
        <Button
          label={saving ? "Saving…" : "Save preferences"}
          disabled={saving}
          onPress={() => void handleSave()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
  },
  content: {
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  heroEyebrow: {
    color: "#C4A574",
    fontSize: 11,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  heroTitle: {
    marginTop: 10,
    color: colors.onPrimary,
    fontSize: 34,
    fontWeight: "600",
    fontFamily: "Georgia",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 10,
    maxWidth: 320,
    color: "rgba(248,247,244,0.7)",
    fontSize: 14,
    lineHeight: 21,
  },
  navSticky: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    zIndex: 20,
  },
  navRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  navChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  navChipActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(25, 40, 65, 0.08)",
  },
  navChipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  navChipLabelActive: {
    color: colors.accent,
  },
  sections: {
    paddingHorizontal: 16,
    gap: 14,
  },
  dashedBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 28,
    alignItems: "center",
  },
  mutedCenter: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  authError: {
    marginTop: 12,
    textAlign: "center",
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  linkWrap: {
    marginTop: 14,
  },
  link: {
    color: colors.accent,
    fontWeight: "600",
  },
  formStack: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  passwordCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 14,
  },
  passwordTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  comingSoon: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  signedInAs: {
    fontSize: 13,
    color: colors.textMuted,
  },
  subheading: {
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.accent,
  },
  checkboxRow: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  checkboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxMark: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  toggleStack: {
    gap: 10,
  },
  optionGrid: {
    gap: 10,
  },
  optionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionCardActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(25, 40, 65, 0.06)",
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  optionHint: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  currencyCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 14,
  },
  orderList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  orderRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 4,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  orderTotal: {
    marginTop: 4,
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
  orderStatus: {
    fontSize: 12,
    textTransform: "capitalize",
    color: colors.textMuted,
  },
  linkList: {
    gap: 10,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  linkRowLabel: {
    fontSize: 14,
    color: colors.text,
  },
  linkRowArrow: {
    color: colors.textMuted,
  },
  logoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  saveBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveHint: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
