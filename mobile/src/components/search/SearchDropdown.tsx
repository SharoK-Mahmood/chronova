import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { SearchResults } from "@/src/features/search/search-catalog";
import { colors } from "@/src/theme/colors";

type SearchDropdownProps = {
  results: SearchResults;
  onSelectWatch: (slug: string) => void;
  onSelectBrand: (brandName: string) => void;
  onViewAll: () => void;
};

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function ResultRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.resultRow}>
      <Text style={styles.resultTitle}>{title}</Text>
      {subtitle ? <Text style={styles.resultSubtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

export function SearchDropdown({
  results,
  onSelectWatch,
  onSelectBrand,
  onViewAll,
}: SearchDropdownProps) {
  if (!results.query) {
    return null;
  }

  const hasResults =
    results.watches.length > 0 || results.brands.length > 0;
  const primaryBrand = results.brands[0]?.name;

  if (!hasResults) {
    return (
      <View style={styles.shell}>
        <Text style={styles.emptyText}>
          No results for “{results.query}”
        </Text>
        <Pressable onPress={onViewAll} style={styles.emptyAction}>
          <Text style={styles.emptyActionLabel}>Search the catalog</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {results.watches.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>Matching watches</SectionLabel>
            {results.watches.map((watch) => (
              <ResultRow
                key={watch.slug}
                title={`${watch.brand} ${watch.name}`}
                subtitle={watch.subtitle}
                onPress={() => onSelectWatch(watch.slug)}
              />
            ))}
          </View>
        ) : null}

        {results.brands.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>Brand matches</SectionLabel>
            {results.brands.map((brand) => (
              <ResultRow
                key={brand.slug}
                title={brand.name}
                subtitle="View brand collection"
                onPress={() => onSelectBrand(brand.name)}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>

      <Pressable onPress={onViewAll} style={styles.footer}>
        <Text style={styles.footerLabel}>
          {primaryBrand
            ? `View all ${primaryBrand} results`
            : "View all results"}
        </Text>
        <Text style={styles.footerArrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    maxHeight: 420,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  scroll: {
    maxHeight: 340,
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  sectionLabel: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: colors.accent,
  },
  resultRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  resultSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingTop: 18,
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyAction: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emptyActionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  footerLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },
  footerArrow: {
    fontSize: 14,
    color: colors.accent,
  },
});
