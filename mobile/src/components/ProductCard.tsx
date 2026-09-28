import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProductMediaCarousel } from "@/src/components/ProductMediaCarousel";
import { useCart } from "@/src/context/CartContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { colors } from "@/src/theme/colors";
import type { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { format } = useCurrency();
  const { has, toggle } = useWishlist();
  const { addItem, entries } = useCart();
  const wishlisted = has(product.slug);
  const inCartQty =
    entries.find((entry) => entry.slug === product.slug)?.quantity ?? 0;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/product/${product.slug}`)}
    >
      <View style={styles.imageWrap}>
        <ProductMediaCarousel
          product={product}
          style={styles.carousel}
          pauseOnTouch={false}
        />
        <Pressable
          accessibilityLabel={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation?.();
            toggle(product.slug);
          }}
          style={styles.wishButton}
        >
          <Text style={styles.wishText}>{wishlisted ? "♥" : "♡"}</Text>
        </Pressable>
      </View>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      {product.subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle}
        </Text>
      ) : null}
      <Text style={styles.price}>{format(product.price)}</Text>
      <Pressable
        disabled={!product.inStock}
        onPress={(event) => {
          event.stopPropagation?.();
          addItem(product.slug, 1, product.price);
        }}
        style={[styles.addBtn, !product.inStock && styles.addBtnDisabled]}
      >
        <Text style={styles.addBtnLabel}>
          {!product.inStock
            ? "Unavailable"
            : inCartQty > 0
              ? `In bag (${inCartQty})`
              : "Add to bag"}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrap: {
    position: "relative",
  },
  carousel: {
    aspectRatio: 0.85,
    width: "100%",
  },
  wishButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  wishText: {
    fontSize: 18,
    color: colors.primary,
  },
  brand: {
    marginTop: 10,
    marginHorizontal: 12,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  name: {
    marginTop: 4,
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    marginTop: 6,
    marginHorizontal: 12,
    fontSize: 14,
    color: colors.accent,
  },
  addBtn: {
    marginTop: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnLabel: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});
