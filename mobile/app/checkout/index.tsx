import { Stack, router, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useCatalog } from "@/src/context/CatalogContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import {
  readAccountPreferences,
} from "@/src/features/account/storage";
import { apiClient, ApiClientError } from "@/src/lib/api";
import { colors } from "@/src/theme/colors";
import {
  DELIVERY_OPTIONS,
  EMPTY_SHIPPING,
  PAYMENT_OPTIONS,
  type CheckoutShippingAddress,
  type CreateOrderInput,
  type DeliveryMethodId,
  type PaymentMethodId,
  type PlacedOrder,
} from "@/src/types/checkout";

export default function CheckoutScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const { entries, clear, itemCount, isReady } = useCart();
  const { getProductBySlug } = useCatalog();
  const { currency, format } = useCurrency();

  const [shipping, setShipping] =
    useState<CheckoutShippingAddress>(EMPTY_SHIPPING);
  const [deliveryMethodId, setDeliveryMethodId] =
    useState<DeliveryMethodId>("standard");
  const [paymentMethodId, setPaymentMethodId] =
    useState<PaymentMethodId>("cod");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const prefs = await readAccountPreferences(user?.id);
      if (cancelled) {
        return;
      }
      const saved = prefs.shippingAddress;
      setShipping({
        ...EMPTY_SHIPPING,
        fullName:
          saved.fullName.trim() ||
          [user?.firstName, user?.lastName].filter(Boolean).join(" "),
        phone: saved.phone,
        city: saved.city,
        street: saved.street,
        details: saved.details,
        governorate: saved.city.trim()
          ? saved.city.trim().toLowerCase()
          : "erbil",
      });
      setPrefsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.firstName, user?.lastName]);

  const lines = useMemo(
    () =>
      entries
        .map((entry) => {
          const product = getProductBySlug(entry.slug);
          if (!product) {
            return null;
          }
          return { entry, product };
        })
        .filter((line): line is NonNullable<typeof line> => line !== null),
    [entries, getProductBySlug],
  );

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.entry.quantity,
    0,
  );
  const shippingUsd =
    DELIVERY_OPTIONS.find((option) => option.id === deliveryMethodId)
      ?.shippingUsd ?? 0;
  const total = subtotal + shippingUsd;

  function patchShipping(patch: Partial<CheckoutShippingAddress>) {
    setShipping((current) => ({ ...current, ...patch }));
  }

  async function placeOrder() {
    if (!user) {
      router.push("/login");
      return;
    }

    if (
      !shipping.fullName.trim() ||
      !shipping.phone.trim() ||
      !shipping.city.trim() ||
      !shipping.street.trim() ||
      !shipping.governorate.trim()
    ) {
      setError("Please complete your shipping address.");
      return;
    }

    setBusy(true);
    setError(null);

    const paymentLabel =
      PAYMENT_OPTIONS.find((option) => option.id === paymentMethodId)?.label ??
      "Payment";

    const body: CreateOrderInput = {
      contact: {
        email: user.email,
        phone: shipping.phone.trim(),
      },
      shippingAddress: {
        ...shipping,
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        city: shipping.city.trim(),
        street: shipping.street.trim(),
        district: shipping.district.trim(),
        details: shipping.details.trim(),
        governorate: shipping.governorate.trim() || "erbil",
      },
      deliveryMethodId,
      paymentMethodId,
      paymentLabel,
      items: lines.map((line) => ({
        slug: line.entry.slug,
        quantity: line.entry.quantity,
      })),
      currency: currency === "IQD" ? "IQD" : "USD",
    };

    try {
      const order = await apiClient<PlacedOrder>("/orders", {
        method: "POST",
        body,
      });
      clear();
      router.replace(`/checkout/confirmation/${order.orderNumber}` as Href);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not place your order. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || !isReady || !prefsReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: "Checkout" }} />
        <View style={styles.centeredPad}>
          <Text style={styles.emptyTitle}>Sign in to checkout</Text>
          <Text style={styles.emptyBody}>
            Create an account or sign in to complete your purchase.
          </Text>
          <Button label="Sign in" onPress={() => router.push("/login")} />
          <Button
            label="Create account"
            variant="secondary"
            onPress={() => router.push("/register")}
          />
        </View>
      </>
    );
  }

  if (itemCount === 0 || lines.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "Checkout" }} />
        <View style={styles.centeredPad}>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Button
            label="Browse watches"
            onPress={() => router.push("/products")}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Checkout" }} />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Shipping address</Text>
          {(
            [
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["governorate", "Governorate"],
              ["city", "City"],
              ["district", "District (optional)"],
              ["street", "Street"],
              ["details", "Details (optional)"],
              ["postalCode", "Postal code (optional)"],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                value={shipping[key]}
                onChangeText={(text) => patchShipping({ [key]: text })}
                placeholder={label}
                placeholderTextColor={colors.textMuted}
                keyboardType={key === "phone" ? "phone-pad" : "default"}
                style={styles.input}
              />
            </View>
          ))}

          <Text style={[styles.heading, styles.headingSpaced]}>Delivery</Text>
          {DELIVERY_OPTIONS.map((option) => {
            const selected = deliveryMethodId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setDeliveryMethodId(option.id)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionHint}>{option.hint}</Text>
              </Pressable>
            );
          })}

          <Text style={[styles.heading, styles.headingSpaced]}>Payment</Text>
          {PAYMENT_OPTIONS.map((option) => {
            const selected = paymentMethodId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPaymentMethodId(option.id)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionHint}>{option.hint}</Text>
              </Pressable>
            );
          })}

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{format(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shippingUsd === 0 ? "Free" : format(shippingUsd)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Estimated total</Text>
              <Text style={styles.totalValue}>{format(total)}</Text>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label={busy ? "Placing order…" : "Complete purchase"}
            disabled={busy}
            onPress={() => void placeOrder()}
          />
          <Button
            label="Back to bag"
            variant="ghost"
            onPress={() => router.back()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  centeredPad: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  headingSpaced: {
    marginTop: 16,
  },
  field: {
    gap: 6,
  },
  label: {
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
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: "rgba(25,40,65,0.06)",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  optionHint: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 15,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});
