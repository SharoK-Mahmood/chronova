import { Stack, router, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { ProductMediaCarousel } from "@/src/components/ProductMediaCarousel";
import { useCart } from "@/src/context/CartContext";
import { useCatalog } from "@/src/context/CatalogContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { apiClient } from "@/src/lib/api";
import { colors } from "@/src/theme/colors";
import {
  CASE_SPEC_FIELDS,
  HANDS_SPEC_FIELDS,
  MOVEMENT_SPEC_FIELDS,
  hasAnyProductDetails,
  type Product,
} from "@/src/types/product";

type SpecTab = "case" | "movement" | "hands";

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { getProductBySlug, isLoading } = useCatalog();
  const { addItem, entries } = useCart();
  const { has, toggle } = useWishlist();
  const { format } = useCurrency();
  const [tab, setTab] = useState<SpecTab>("case");
  const [remote, setRemote] = useState<Product | null>(null);
  const [remoteError, setRemoteError] = useState(false);

  const catalogProduct = useMemo(
    () => (slug ? getProductBySlug(slug) : undefined),
    [getProductBySlug, slug],
  );

  useEffect(() => {
    if (!slug) {
      return;
    }
    let cancelled = false;
    setRemoteError(false);
    (async () => {
      try {
        const product = await apiClient<Product>(
          `/products/${encodeURIComponent(slug)}`,
        );
        if (!cancelled) {
          setRemote(product);
        }
      } catch {
        if (!cancelled) {
          setRemoteError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const product = remote ?? catalogProduct;

  if ((isLoading || (!product && !remoteError)) && !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Watch not found"
          subtitle="It may have been removed from the catalog."
        />
      </View>
    );
  }

  const wishlisted = has(product.slug);
  const inCartQty =
    entries.find((entry) => entry.slug === product.slug)?.quantity ?? 0;
  const details = product.details;
  const showDetails = hasAnyProductDetails(details);

  const caseRows = CASE_SPEC_FIELDS.map((field) => ({
    label: field.label,
    value: details?.case?.[field.key] ?? "",
  })).filter((row) => row.value);

  const movementRows = MOVEMENT_SPEC_FIELDS.map((field) => ({
    label: field.label,
    value: details?.movement?.[field.key] ?? "",
  })).filter((row) => row.value);

  const handsRows = HANDS_SPEC_FIELDS.map((field) => ({
    label: field.label,
    value: details?.hands?.[field.key] ?? "",
  })).filter((row) => row.value);

  const activeRows =
    tab === "case" ? caseRows : tab === "movement" ? movementRows : handsRows;

  const availableTabs = (
    [
      { id: "case" as const, label: "Case", count: caseRows.length },
      { id: "movement" as const, label: "Movement", count: movementRows.length },
      { id: "hands" as const, label: "Hands", count: handsRows.length },
    ] as const
  ).filter((item) => item.count > 0);

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ProductMediaCarousel product={product} style={styles.gallery} />

        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        {product.subtitle ? (
          <Text style={styles.subtitle}>{product.subtitle}</Text>
        ) : null}
        {product.reference ? (
          <Text style={styles.reference}>Reference {product.reference}</Text>
        ) : null}
        <Text style={styles.price}>{format(product.price)}</Text>
        <Text style={styles.stock}>
          {product.inStock ? "In stock" : "Currently unavailable"}
        </Text>

        {product.description ? (
          <Text style={styles.description}>{product.description}</Text>
        ) : null}

        {showDetails ? (
          <View style={styles.specs}>
            <Text style={styles.specsTitle}>Specifications</Text>
            {availableTabs.length > 0 ? (
              <View style={styles.tabs}>
                {availableTabs.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setTab(item.id)}
                    style={[styles.tab, tab === item.id && styles.tabActive]}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        tab === item.id && styles.tabLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {activeRows.length > 0 ? (
              <View style={styles.specTable}>
                {activeRows.map((row) => (
                  <View key={row.label} style={styles.specRow}>
                    <Text style={styles.specLabel}>{row.label}</Text>
                    <Text style={styles.specValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {details?.care ? (
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>Care / warranty</Text>
                <Text style={styles.infoBody}>{details.care}</Text>
              </View>
            ) : null}
            {details?.giftWrapping ? (
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>Gift wrapping</Text>
                <Text style={styles.infoBody}>{details.giftWrapping}</Text>
              </View>
            ) : null}
            {details?.shippingReturns ? (
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>Shipping & returns</Text>
                <Text style={styles.infoBody}>{details.shippingReturns}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={
              !product.inStock
                ? "Unavailable"
                : inCartQty > 0
                  ? `In bag (${inCartQty}) · Add another`
                  : "Add to bag"
            }
            disabled={!product.inStock}
            onPress={() => {
              addItem(product.slug, 1, product.price);
            }}
          />
          {inCartQty > 0 ? (
            <Button
              label="Complete purchase"
              variant="secondary"
              onPress={() => router.push("/checkout" as Href)}
            />
          ) : null}
          <Button
            label={wishlisted ? "Saved to wishlist" : "Add to wishlist"}
            variant="secondary"
            onPress={() => toggle(product.slug)}
          />
          <Button
            label="Back to shop"
            variant="ghost"
            onPress={() => router.push("/products")}
          />
        </View>
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
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  gallery: {
    height: 380,
    width: "100%",
  },
  brand: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  name: {
    marginTop: 6,
    marginHorizontal: 20,
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    fontFamily: "Georgia",
  },
  subtitle: {
    marginTop: 6,
    marginHorizontal: 20,
    fontSize: 15,
    color: colors.textMuted,
  },
  reference: {
    marginTop: 4,
    marginHorizontal: 20,
    fontSize: 13,
    color: colors.textMuted,
  },
  price: {
    marginTop: 14,
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: "700",
    color: colors.accent,
  },
  stock: {
    marginTop: 8,
    marginHorizontal: 20,
    fontSize: 13,
    color: colors.textMuted,
  },
  description: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  specs: {
    marginTop: 28,
    marginHorizontal: 20,
  },
  specsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    fontFamily: "Georgia",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(25,40,65,0.08)",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.accent,
  },
  specTable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  specRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 4,
  },
  specLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  specValue: {
    fontSize: 14,
    color: colors.text,
  },
  infoBlock: {
    marginTop: 18,
    gap: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  infoBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  actions: {
    marginTop: 28,
    marginHorizontal: 20,
    gap: 10,
  },
});
