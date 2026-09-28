import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeCopy } from "@/src/constants/home-copy";
import { colors } from "@/src/theme/colors";

export function CollectionsSection() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{homeCopy.collections.eyebrow}</Text>
        <Text style={styles.title}>{homeCopy.collections.title}</Text>
        <Text style={styles.subtitle}>{homeCopy.collections.subtitle}</Text>
      </View>

      <View style={styles.grid}>
        {homeCopy.collections.items.map((collection) => (
          <Link
            key={collection.title}
            href={{
              pathname: "/products",
              params: { category: collection.category },
            }}
            asChild
          >
            <Pressable style={styles.card}>
              <Text style={styles.cardEyebrow}>{collection.eyebrow}</Text>
              <Text style={styles.cardTitle}>{collection.title}</Text>
              <Text style={styles.cardDescription}>
                {collection.description}
              </Text>
              <Text style={styles.cardCta}>
                {homeCopy.collections.explore} →
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 28,
    gap: 12,
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
    color: "rgba(248,247,244,0.65)",
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(248,247,244,0.1)",
    backgroundColor: "rgba(248,247,244,0.04)",
    padding: 24,
  },
  cardEyebrow: {
    color: "#C4A574",
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  cardTitle: {
    marginTop: 10,
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.3,
    fontFamily: "Georgia",
  },
  cardDescription: {
    marginTop: 8,
    color: "rgba(248,247,244,0.6)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260,
  },
  cardCta: {
    marginTop: 22,
    color: "#C4A574",
    fontSize: 14,
    fontWeight: "600",
  },
});
