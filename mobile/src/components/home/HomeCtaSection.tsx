import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeCopy } from "@/src/constants/home-copy";
import { colors } from "@/src/theme/colors";

export function HomeCtaSection() {
  return (
    <View style={styles.section}>
      <View style={styles.glow} />
      <View style={styles.topRule} />

      <Text style={styles.eyebrow}>{homeCopy.cta.eyebrow}</Text>
      <Text style={styles.title}>{homeCopy.cta.title}</Text>
      <Text style={styles.subtitle}>{homeCopy.cta.subtitle}</Text>

      <View style={styles.actions}>
        <Link href="/products" asChild>
          <Pressable style={styles.primaryCta}>
            <Text style={styles.primaryCtaLabel}>{homeCopy.cta.explore}</Text>
          </Pressable>
        </Link>
        <Link href="/products" asChild>
          <Pressable style={styles.secondaryCta}>
            <Text style={styles.secondaryCtaLabel}>
              {homeCopy.cta.viewSale}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 56,
    alignItems: "center",
    overflow: "hidden",
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(196, 165, 116, 0.14)",
  },
  topRule: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(196, 165, 116, 0.5)",
  },
  eyebrow: {
    color: "#C4A574",
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    fontWeight: "500",
    textAlign: "center",
  },
  title: {
    marginTop: 16,
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.4,
    textAlign: "center",
    maxWidth: 340,
    fontFamily: "Georgia",
  },
  subtitle: {
    marginTop: 14,
    color: "rgba(248,247,244,0.65)",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 320,
  },
  actions: {
    marginTop: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  primaryCta: {
    backgroundColor: colors.onPrimary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryCtaLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryCta: {
    borderWidth: 1,
    borderColor: "rgba(248,247,244,0.25)",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },
  secondaryCtaLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
});
