import { FlatList, StyleSheet, View } from "react-native";

import { EmptyState } from "@/src/components/EmptyState";
import { ProductCard } from "@/src/components/ProductCard";
import { useCatalog } from "@/src/context/CatalogContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { colors } from "@/src/theme/colors";

export default function WishlistScreen() {
  const { slugs } = useWishlist();
  const { getProductBySlug } = useCatalog();

  const products = slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (products.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Your wishlist is empty"
          subtitle="Tap the heart on any watch to save it here."
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ProductCard product={item} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  item: {
    flex: 1,
  },
});
