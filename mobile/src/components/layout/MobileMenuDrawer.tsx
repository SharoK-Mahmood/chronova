import { router, usePathname } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CloseIcon } from "@/src/components/icons/NavIcons";
import { useCurrency } from "@/src/context/CurrencyContext";
import { useMenu } from "@/src/context/MenuContext";
import { colors } from "@/src/theme/colors";

type MenuLink = {
  label: string;
  href: string;
  params?: Record<string, string>;
  highlight?: boolean;
};

const MENU_LINKS: MenuLink[] = [
  { label: "Home", href: "/" },
  { label: "Watches", href: "/products" },
  { label: "Men", href: "/products", params: { category: "men" } },
  { label: "Women", href: "/products", params: { category: "women" } },
  { label: "Brands", href: "/products" },
  { label: "New arrivals", href: "/products" },
  { label: "Sale", href: "/products", highlight: true },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/account" },
];

function isActive(pathname: string, link: MenuLink): boolean {
  if (link.href === "/") {
    return pathname === "/" || pathname === "/index";
  }
  if (link.params?.category) {
    return false;
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function MobileMenuDrawer() {
  const { isOpen, closeMenu } = useMenu();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { currency, setCurrency, currencies } = useCurrency();

  function navigate(link: MenuLink) {
    closeMenu();
    if (link.params) {
      router.push({ pathname: link.href as "/products", params: link.params });
      return;
    }
    if (link.href === "/") {
      router.push("/");
      return;
    }
    router.push(link.href as "/products" | "/wishlist" | "/account");
  }

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={closeMenu}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeMenu} />
        <View
          style={[
            styles.drawer,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <Pressable
              accessibilityLabel="Close menu"
              onPress={closeMenu}
              style={styles.closeButton}
            >
              <CloseIcon size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.nav}>
            {MENU_LINKS.map((link) => {
              const active = isActive(pathname, link);
              return (
                <Pressable
                  key={`${link.label}-${link.params?.category ?? ""}`}
                  onPress={() => navigate(link)}
                  style={[styles.link, active && styles.linkActive]}
                >
                  <Text
                    style={[
                      styles.linkLabel,
                      active && styles.linkLabelActive,
                      link.highlight && !active && styles.linkHighlight,
                    ]}
                  >
                    {link.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.currencyBlock}>
            <Text style={styles.currencyLabel}>Display currency</Text>
            <View style={styles.currencyRow}>
              {(Object.keys(currencies) as Array<"USD" | "IQD">).map((code) => {
                const selected = currency === code;
                return (
                  <Pressable
                    key={code}
                    onPress={() => setCurrency(code)}
                    style={[
                      styles.currencyChip,
                      selected && styles.currencyChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyChipLabel,
                        selected && styles.currencyChipLabelActive,
                      ]}
                    >
                      {code}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(17,17,17,0.4)",
  },
  drawer: {
    width: "82%",
    maxWidth: 320,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 4, height: 0 },
    elevation: 12,
  },
  drawerHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: colors.text,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  link: {
    minHeight: 48,
    justifyContent: "center",
    borderLeftWidth: 2,
    borderLeftColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  linkActive: {
    borderLeftColor: colors.accent,
    backgroundColor: "rgba(25, 40, 65, 0.08)",
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  linkLabelActive: {
    fontWeight: "700",
    color: colors.accent,
  },
  linkHighlight: {
    color: colors.accent,
  },
  currencyBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  currencyLabel: {
    marginBottom: 10,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  currencyRow: {
    flexDirection: "row",
    gap: 8,
  },
  currencyChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  currencyChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyChipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  currencyChipLabelActive: {
    color: colors.onPrimary,
  },
});
