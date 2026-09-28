import { Link, router, type Href } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

import { Button } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { useCatalog } from "@/src/context/CatalogContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { pickProductImage } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";

export default function CartScreen() {
  const { user } = useAuth();
  const { entries, setQuantity, removeItem, clear, itemCount } = useCart();
  const { getProductBySlug } = useCatalog();
  const { format } = useCurrency();

  const lines = entries
    .map((entry) => {
      const product = getProductBySlug(entry.slug);
      if (!product) {
        return null;
      }
      return { entry, product };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.entry.quantity,
    0,
  );

  if (lines.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Nothing in your bag yet"
          subtitle="Discover exceptional watches and add your favourites."
        />
        <Link href="/products" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaLabel}>Explore collection</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={lines}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Your selection</Text>
            <Text style={styles.title}>Shopping Bag</Text>
            <Text style={styles.count}>
              {itemCount} in your bag
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{format(total)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalMuted}>At checkout</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.estimatedLabel}>Estimated total</Text>
              <Text style={styles.totalValue}>{format(total)}</Text>
            </View>
            <Text style={styles.note}>Prices shown in your selected currency.</Text>
            <Button
              label="Complete purchase"
              onPress={() =>
                router.push((user ? "/checkout" : "/login") as Href)
              }
            />
            <View style={styles.secondaryRow}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => router.push("/products")}
              >
                <Text style={styles.secondaryLabel}>Continue shopping</Text>
              </Pressable>
              <Pressable onPress={clear} style={styles.secondaryBtn}>
                <Text style={styles.clearLabel}>Clear bag</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const imageUri = pickProductImage(item.product);
          return (
            <View style={styles.row}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.thumb}
                  contentFit="contain"
                />
              ) : (
                <View style={[styles.thumb, styles.thumbEmpty]} />
              )}
              <View style={styles.meta}>
                <Text style={styles.brand}>{item.product.brand}</Text>
                <Text style={styles.name}>{item.product.name}</Text>
                {item.product.subtitle ? (
                  <Text style={styles.subtitle}>{item.product.subtitle}</Text>
                ) : null}
                <Text style={styles.price}>
                  {format(item.product.price * item.entry.quantity)}
                </Text>
                <View style={styles.qtyRow}>
                  <Pressable
                    onPress={() =>
                      setQuantity(item.entry.slug, item.entry.quantity - 1)
                    }
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnLabel}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{item.entry.quantity}</Text>
                  <Pressable
                    onPress={() =>
                      setQuantity(item.entry.slug, item.entry.quantity + 1)
                    }
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnLabel}>+</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => removeItem(item.entry.slug)}
                    style={styles.remove}
                  >
                    <Text style={styles.removeLabel}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    fontFamily: "Georgia",
  },
  count: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  thumb: {
    width: 84,
    height: 100,
    backgroundColor: "#EEF2F6",
    borderRadius: 8,
  },
  thumbEmpty: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  meta: {
    flex: 1,
  },
  brand: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  name: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    marginTop: 6,
    color: colors.accent,
    fontWeight: "600",
  },
  qtyRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnLabel: {
    fontSize: 18,
    color: colors.text,
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  remove: {
    marginLeft: "auto",
  },
  removeLabel: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 15,
    color: colors.textMuted,
  },
  totalMuted: {
    fontSize: 15,
    color: colors.textMuted,
  },
  estimatedLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  note: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  secondaryLabel: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  clearLabel: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 13,
  },
  cta: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaLabel: {
    color: colors.onPrimary,
    fontWeight: "700",
  },
});
