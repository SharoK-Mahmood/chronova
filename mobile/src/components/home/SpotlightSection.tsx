import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeCopy } from "@/src/constants/home-copy";
import { useCart } from "@/src/context/CartContext";
import { useCatalog } from "@/src/context/CatalogContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { hasProductPhoto, pickProductImage } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";

const SPOTLIGHT_SLUG = "land-dweller-40";

export function SpotlightSection() {
  const { getProductBySlug, isLoading } = useCatalog();
  const { format } = useCurrency();
  const { addItem } = useCart();
  const product = getProductBySlug(SPOTLIGHT_SLUG);

  if (isLoading || !product) {
    return null;
  }

  const imageUri = pickProductImage(product);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{homeCopy.spotlight.eyebrow}</Text>
          <Text style={styles.title}>{homeCopy.spotlight.title}</Text>
        </View>
        <Text style={styles.subtitle}>{homeCopy.spotlight.subtitle}</Text>
      </View>

      <Pressable
        onPress={() => router.push(`/product/${product.slug}`)}
        style={styles.imageCard}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{homeCopy.spotlight.bestseller}</Text>
        </View>
        {hasProductPhoto(product.imageUrl) && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </Pressable>

      <View style={styles.details}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        {product.subtitle ? (
          <Text style={styles.productSubtitle}>{product.subtitle}</Text>
        ) : null}
        <Text style={styles.description} numberOfLines={4}>
          {product.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{format(product.price)}</Text>
          <View style={styles.actions}>
            <Link href={`/product/${product.slug}`} asChild>
              <Pressable style={styles.primaryCta}>
                <Text style={styles.primaryCtaLabel}>
                  {homeCopy.spotlight.discover}
                </Text>
              </Pressable>
            </Link>
            <Pressable
              style={styles.secondaryCta}
              onPress={() => addItem(product.slug, 1, product.price)}
            >
              <Text style={styles.secondaryCtaLabel}>
                {homeCopy.spotlight.addToBag}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    gap: 14,
    marginBottom: 28,
  },
  headerCopy: {
    gap: 10,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
    fontFamily: "Georgia",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 280,
  },
  imageCard: {
    aspectRatio: 4 / 5,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(25, 40, 65, 0.3)",
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeLabel: {
    color: colors.accent,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: "100%",
    padding: 36,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  details: {
    marginTop: 28,
    gap: 10,
  },
  brand: {
    color: colors.accent,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  name: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -0.6,
    fontFamily: "Georgia",
  },
  productSubtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
  description: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  footer: {
    marginTop: 18,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 16,
  },
  price: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 10,
  },
  primaryCtaLabel: {
    color: colors.onPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryCta: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 10,
  },
  secondaryCtaLabel: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
