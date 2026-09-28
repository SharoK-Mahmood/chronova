import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { EmptyState } from "@/src/components/EmptyState";
import { ProductCard } from "@/src/components/ProductCard";
import { useCatalog } from "@/src/context/CatalogContext";
import { colors } from "@/src/theme/colors";

type Filter = "all" | "men" | "women";

function parseFilter(value: string | string[] | undefined): Filter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "men" || raw === "women" || raw === "all") {
    return raw;
  }
  return "all";
}

function parseQuery(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default function ProductsScreen() {
  const { products, isLoading, error, refresh } = useCatalog();
  const params = useLocalSearchParams<{ category?: string; q?: string }>();
  const [query, setQuery] = useState(() => parseQuery(params.q));
  const [filter, setFilter] = useState<Filter>(() =>
    parseFilter(params.category),
  );

  useEffect(() => {
    setFilter(parseFilter(params.category));
  }, [params.category]);

  useEffect(() => {
    setQuery(parseQuery(params.q));
  }, [params.q]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch =
        filter === "all" ||
        product.category === filter ||
        product.category === "unisex";
      if (!categoryMatch) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        (product.subtitle?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [products, query, filter]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <EmptyState title="Couldn’t load watches" subtitle={error} />
        <Pressable onPress={() => void refresh()} style={styles.retry}>
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.controls}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search watches or brands"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <View style={styles.filters}>
          {(["all", "men", "women"] as Filter[]).map((value) => (
            <Pressable
              key={value}
              onPress={() => setFilter(value)}
              style={[styles.chip, filter === value && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  filter === value && styles.chipLabelActive,
                ]}
              >
                {value === "all" ? "All" : value === "men" ? "Men" : "Women"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No watches found"
            subtitle="Try another search or filter."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textTransform: "capitalize",
  },
  chipLabelActive: {
    color: colors.onPrimary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  item: {
    flex: 1,
  },
  retry: {
    marginTop: 12,
  },
  retryLabel: {
    color: colors.primary,
    fontWeight: "700",
  },
});
