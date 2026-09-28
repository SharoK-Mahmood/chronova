import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { useCurrency } from "@/src/context/CurrencyContext";
import { apiClient } from "@/src/lib/api";
import { colors } from "@/src/theme/colors";
import type { PlacedOrder } from "@/src/types/checkout";

export default function OrderConfirmationScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const { format } = useCurrency();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await apiClient<PlacedOrder>(
          `/orders/${encodeURIComponent(orderNumber)}`,
        );
        if (!cancelled) {
          setOrder(data);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load this order.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  return (
    <>
      <Stack.Screen options={{ title: "Order confirmed" }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {!order && !error ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {order ? (
          <>
            <Text style={styles.eyebrow}>Thank you</Text>
            <Text style={styles.title}>Order confirmed</Text>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.body}>
              We have received your order. Estimated delivery:{" "}
              {order.estimatedDelivery.label}.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total</Text>
              <Text style={styles.cardValue}>{format(order.totalUsd)}</Text>
              <Text style={styles.cardMeta}>{order.paymentLabel}</Text>
              <Text style={styles.cardMeta}>{order.deliveryLabel}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Items</Text>
              {order.lineItems.map((item) => (
                <Text key={item.slug} style={styles.itemLine}>
                  {item.quantity}× {item.brand} {item.name}
                </Text>
              ))}
            </View>

            <Button
              label="Continue shopping"
              onPress={() => router.replace("/products")}
            />
            <Button
              label="View account"
              variant="secondary"
              onPress={() => router.replace("/account")}
            />
          </>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    fontFamily: "Georgia",
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  card: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.surface,
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  cardMeta: {
    fontSize: 14,
    color: colors.textMuted,
  },
  itemLine: {
    fontSize: 14,
    color: colors.text,
  },
  error: {
    color: colors.danger,
  },
});
