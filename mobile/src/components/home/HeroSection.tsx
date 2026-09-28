import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BrandLogo } from "@/src/components/BrandLogo";
import { homeCopy } from "@/src/constants/home-copy";
import { useCatalog } from "@/src/context/CatalogContext";
import { hasProductPhoto, pickProductImage } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";

const ROTATE_MS = 5500;
const MAX_HERO_VISUALS = 5;
const VISUAL_HEIGHT = Math.min(Dimensions.get("window").height * 0.42, 360);

export function HeroSection() {
  const { products, isLoading } = useCatalog();
  const [activeIndex, setActiveIndex] = useState(0);

  const visuals = useMemo(() => {
    const withPhotos = products.filter((product) =>
      hasProductPhoto(product.imageUrl),
    );
    const preferred = withPhotos.filter(
      (product) =>
        product.imageUrl.startsWith("/uploads/") ||
        product.imageUrl.includes("/uploads/"),
    );
    const pool = preferred.length > 0 ? preferred : withPhotos;

    return pool.slice(0, MAX_HERO_VISUALS).map((product) => ({
      uri: pickProductImage(product),
      alt: `${product.brand} ${product.name}`,
      slug: product.slug,
    }));
  }, [products]);

  const count = visuals.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [count]);

  useEffect(() => {
    if (count < 2) {
      return;
    }

    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, ROTATE_MS);

    return () => clearInterval(id);
  }, [count]);

  return (
    <View style={styles.section}>
      <View style={[styles.visual, { height: VISUAL_HEIGHT }]}>
        <View style={styles.visualGlow} />
        {isLoading ? (
          <View style={styles.visualSkeleton} />
        ) : (
          visuals.map((visual, index) => {
            const isActive = index === activeIndex % Math.max(count, 1);
            if (!visual.uri) {
              return null;
            }

            return (
              <View
                key={visual.slug}
                pointerEvents="none"
                style={[
                  styles.visualFrame,
                  { opacity: isActive ? 1 : 0 },
                ]}
              >
                <Image
                  source={{ uri: visual.uri }}
                  style={styles.visualImage}
                  contentFit="contain"
                  transition={600}
                />
              </View>
            );
          })
        )}
      </View>

      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{homeCopy.tagline}</Text>
        <BrandLogo height={44} variant="light" style={styles.brandLogo} />
        <Text style={styles.title}>
          {homeCopy.heroTitle}{" "}
          <Text style={styles.titleAccent}>{homeCopy.heroTitleAccent}</Text>
        </Text>
        <Text style={styles.subtitle}>{homeCopy.heroSubtitle}</Text>

        <View style={styles.actions}>
          <Link href="/products" asChild>
            <Pressable style={styles.primaryCta}>
              <Text style={styles.primaryCtaLabel}>
                {homeCopy.shopCollection}
              </Text>
            </Pressable>
          </Link>
          <Link href="/products" asChild>
            <Pressable style={styles.secondaryCta}>
              <Text style={styles.secondaryCtaLabel}>
                {homeCopy.exploreMaisons}
              </Text>
            </Pressable>
          </Link>
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
  },
  visual: {
    backgroundColor: colors.heroVisual,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  visualGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(25, 40, 65, 0.35)",
  },
  visualSkeleton: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#121A28",
  },
  visualFrame: {
    ...StyleSheet.absoluteFill,
    padding: 28,
  },
  visualImage: {
    width: "100%",
    height: "100%",
  },
  copy: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 4.2,
    textTransform: "uppercase",
  },
  brandLogo: {
    marginTop: 18,
    alignSelf: "flex-start",
  },
  title: {
    marginTop: 16,
    maxWidth: 340,
    color: "rgba(17,17,17,0.9)",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "500",
    letterSpacing: -0.3,
    fontFamily: "Georgia",
  },
  titleAccent: {
    color: colors.accent,
  },
  subtitle: {
    marginTop: 14,
    maxWidth: 320,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  actions: {
    marginTop: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryCtaLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryCta: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },
  secondaryCtaLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
