import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";

import { homeCopy } from "@/src/constants/home-copy";
import { useCatalog } from "@/src/context/CatalogContext";
import { useCurrency } from "@/src/context/CurrencyContext";
import { hasProductPhoto, pickProductImage } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import type { Product } from "@/src/types/product";

const MAX_ITEMS = 18;
const CARD_WIDTH = Math.min(Dimensions.get("window").width * 0.78, 320);
const CARD_GAP = 16;

function shuffleProducts(products: Product[]): Product[] {
  const next = [...products];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex]!;
    next[swapIndex] = current!;
  }
  return next.slice(0, MAX_ITEMS);
}

export function FeaturedSection() {
  const { products, isLoading, error, refresh } = useCatalog();
  const { format } = useCurrency();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(() => shuffleProducts(products), [products]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) {
        setActiveIndex(first.index);
      }
    },
  ).current;

  return (
    <View style={styles.section}>
      <View style={styles.glow} />

      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{homeCopy.featured.eyebrow}</Text>
          <Text style={styles.title}>{homeCopy.featured.title}</Text>
          <Text style={styles.subtitle}>{homeCopy.featured.subtitle}</Text>
        </View>
        <Link href="/products" asChild>
          <Pressable style={styles.viewAll}>
            <Text style={styles.viewAllLabel}>{homeCopy.featured.viewAll}</Text>
          </Pressable>
        </Link>
      </View>

      {isLoading ? (
        <Text style={styles.status}>Loading…</Text>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void refresh()}>
            <Text style={styles.retryLabel}>Retry</Text>
          </Pressable>
        </View>
      ) : items.length === 0 ? (
        <Text style={styles.status}>{homeCopy.featured.empty}</Text>
      ) : (
        <>
          <Text style={styles.hint}>{homeCopy.featured.swipeHint}</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_GAP}
            snapToAlignment="start"
            contentContainerStyle={styles.rail}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP),
              );
              if (index !== activeIndex && index >= 0 && index < items.length) {
                setActiveIndex(index);
              }
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => {
              const imageUri = pickProductImage(item);
              return (
                <Pressable
                  style={styles.card}
                  onPress={() => router.push(`/product/${item.slug}`)}
                >
                  <View style={styles.imageWrap}>
                    {hasProductPhoto(item.imageUrl) && imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        contentFit="contain"
                        transition={200}
                      />
                    ) : (
                      <View style={styles.imagePlaceholder} />
                    )}
                    <View style={styles.imageFade} />
                  </View>
                  <Text style={styles.brand}>{item.brand}</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.subtitle ? (
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                  <Text style={styles.price}>{format(item.price)}</Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.dots}>
            {items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 36,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: -40,
    left: "15%",
    right: "15%",
    height: 180,
    backgroundColor: "rgba(196, 165, 116, 0.12)",
    borderRadius: 200,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 20,
  },
  headerCopy: {
    gap: 10,
    maxWidth: 360,
  },
  eyebrow: {
    color: "#C4A574",
    fontSize: 11,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  title: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.4,
    fontFamily: "Georgia",
  },
  subtitle: {
    color: "rgba(248,247,244,0.6)",
    fontSize: 14,
    lineHeight: 21,
  },
  viewAll: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(248,247,244,0.25)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    paddingHorizontal: 24,
    marginBottom: 14,
    color: "rgba(248,247,244,0.4)",
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  status: {
    paddingHorizontal: 24,
    color: "rgba(248,247,244,0.55)",
    fontSize: 14,
  },
  errorBox: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(248,247,244,0.08)",
    gap: 10,
  },
  errorText: {
    color: colors.onPrimary,
  },
  retryLabel: {
    color: "#C4A574",
    fontWeight: "700",
  },
  rail: {
    paddingHorizontal: 24,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
  },
  imageWrap: {
    aspectRatio: 3 / 4,
    backgroundColor: "rgba(248,247,244,0.08)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(248,247,244,0.15)",
  },
  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "33%",
    backgroundColor: "rgba(17,17,17,0.28)",
  },
  brand: {
    marginTop: 14,
    color: "#C4A574",
    fontSize: 10,
    letterSpacing: 2.8,
    textTransform: "uppercase",
  },
  name: {
    marginTop: 6,
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    marginTop: 4,
    color: "rgba(248,247,244,0.5)",
    fontSize: 13,
  },
  price: {
    marginTop: 8,
    color: "#C4A574",
    fontSize: 15,
  },
  dots: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(248,247,244,0.25)",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#C4A574",
  },
});
