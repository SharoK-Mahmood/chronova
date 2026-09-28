import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandLogo } from "@/src/components/BrandLogo";
import { CartIcon, MenuIcon, SearchIcon } from "@/src/components/icons/NavIcons";
import { SearchDropdown } from "@/src/components/search/SearchDropdown";
import { useCart } from "@/src/context/CartContext";
import { useCatalog } from "@/src/context/CatalogContext";
import { useMenu } from "@/src/context/MenuContext";
import { searchCatalog } from "@/src/features/search/search-catalog";
import { colors } from "@/src/theme/colors";

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { openMenu } = useMenu();
  const { itemCount } = useCart();
  const { products } = useCatalog();
  const inputRef = useRef<TextInput>(null);
  const overlayInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(
    () => searchCatalog(query, products),
    [query, products],
  );

  useEffect(() => {
    if (!searchOpen) {
      return;
    }
    const id = setTimeout(() => overlayInputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    inputRef.current?.blur();
  }

  function openSearch() {
    setSearchOpen(true);
  }

  function goToProducts(searchQuery: string) {
    const trimmed = searchQuery.trim();
    closeSearch();
    router.push({
      pathname: "/products",
      params: trimmed ? { q: trimmed } : {},
    });
  }

  function submitSearch() {
    goToProducts(query);
  }

  function selectWatch(slug: string) {
    closeSearch();
    setQuery("");
    router.push(`/product/${slug}`);
  }

  function selectBrand(brandName: string) {
    setQuery(brandName);
    goToProducts(brandName);
  }

  return (
    <>
      <View style={[styles.wrap, { paddingTop: insets.top }]}>
        <View style={styles.row}>
          <Pressable
            accessibilityLabel="Open menu"
            hitSlop={8}
            onPress={openMenu}
            style={styles.iconButton}
          >
            <MenuIcon size={24} color={colors.textMuted} />
          </Pressable>

          <Pressable
            accessibilityLabel="Home"
            onPress={() => router.push("/")}
            style={styles.logoWrap}
          >
            <BrandLogo height={28} variant="light" />
          </Pressable>

          <Pressable
            accessibilityLabel="Bag"
            hitSlop={8}
            onPress={() => router.push("/cart")}
            style={styles.iconButton}
          >
            <CartIcon size={22} color={colors.textMuted} />
            {itemCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {itemCount > 9 ? "9+" : itemCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <Pressable onPress={openSearch} style={styles.searchWrap}>
          <SearchIcon size={16} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            value={query}
            editable={false}
            pointerEvents="none"
            placeholder="Search watches, brands, or models…"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </Pressable>
      </View>

      <Modal
        visible={searchOpen}
        transparent
        animationType="fade"
        onRequestClose={closeSearch}
      >
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <View style={styles.overlayHeader}>
            <View style={[styles.searchWrap, styles.searchWrapActive]}>
              <SearchIcon size={16} color={colors.textMuted} />
              <TextInput
                ref={overlayInputRef}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={submitSearch}
                placeholder="Search watches, brands, or models…"
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                clearButtonMode="while-editing"
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <Pressable onPress={closeSearch} hitSlop={8} style={styles.cancel}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
          </View>

          {query.trim().length > 0 ? (
            <View style={styles.dropdownWrap}>
              <SearchDropdown
                results={results}
                onSelectWatch={selectWatch}
                onSelectBrand={selectBrand}
                onViewAll={submitSearch}
              />
            </View>
          ) : null}

          <Pressable style={styles.overlayDismiss} onPress={closeSearch} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    zIndex: 40,
  },
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  logoWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: "700",
  },
  searchWrap: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  searchWrapActive: {
    flex: 1,
    marginHorizontal: 0,
    borderColor: "rgba(25, 40, 65, 0.35)",
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,17,17,0.28)",
  },
  overlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cancel: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
  dropdownWrap: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  overlayDismiss: {
    flex: 1,
  },
});
