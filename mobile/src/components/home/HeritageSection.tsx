import { StyleSheet, Text, View } from "react-native";

import { homeCopy } from "@/src/constants/home-copy";
import { colors } from "@/src/theme/colors";

export function HeritageSection() {
  return (
    <View style={styles.section}>
      {homeCopy.heritage.map((pillar) => (
        <View key={pillar.title} style={styles.pillar}>
          <Text style={styles.title}>{pillar.title}</Text>
          <Text style={styles.description}>{pillar.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 24,
  },
  pillar: {
    gap: 10,
  },
  title: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
