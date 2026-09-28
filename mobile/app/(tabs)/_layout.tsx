import { Tabs } from "expo-router";
import { View } from "react-native";

import {
  AccountIcon,
  CartIcon,
  CategoriesIcon,
  HomeIcon,
  WishlistIcon,
} from "@/src/components/icons/NavIcons";
import { AppHeader } from "@/src/components/layout/AppHeader";
import { MobileMenuDrawer } from "@/src/components/layout/MobileMenuDrawer";
import { useCart } from "@/src/context/CartContext";
import { MenuProvider } from "@/src/context/MenuContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { colors } from "@/src/theme/colors";

function TabBarIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {focused ? (
        <View
          style={{
            position: "absolute",
            top: -8,
            width: 28,
            height: 2,
            borderRadius: 999,
            backgroundColor: colors.accent,
          }}
        />
      ) : null}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? "rgba(25, 40, 65, 0.1)" : "transparent",
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <MenuProvider>
      <Tabs
        screenOptions={{
          header: () => <AppHeader />,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            letterSpacing: 0.2,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 64,
            paddingTop: 4,
            paddingBottom: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused}>
                <HomeIcon size={20} color={String(color)} />
              </TabBarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Categories",
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused}>
                <CategoriesIcon size={20} color={String(color)} />
              </TabBarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Wishlist",
            tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused}>
                <WishlistIcon size={20} color={String(color)} />
              </TabBarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarBadge: itemCount > 0 ? itemCount : undefined,
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused}>
                <CartIcon size={20} color={String(color)} />
              </TabBarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused}>
                <AccountIcon size={20} color={String(color)} />
              </TabBarIcon>
            ),
          }}
        />
      </Tabs>
      <MobileMenuDrawer />
    </MenuProvider>
  );
}
