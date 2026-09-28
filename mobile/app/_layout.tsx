import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { CatalogProvider } from "@/src/context/CatalogContext";
import { CurrencyProvider } from "@/src/context/CurrencyContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { colors } from "@/src/theme/colors";

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CatalogProvider>
          <CartProvider>
            <WishlistProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.text,
                  headerTitleStyle: { fontWeight: "600" },
                  headerShadowVisible: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="product/[slug]"
                  options={{ title: "Watch" }}
                />
                <Stack.Screen name="checkout/index" options={{ title: "Checkout" }} />
                <Stack.Screen
                  name="checkout/confirmation/[orderNumber]"
                  options={{ title: "Order confirmed" }}
                />
                <Stack.Screen name="login" options={{ title: "Sign in" }} />
                <Stack.Screen name="register" options={{ title: "Create account" }} />
              </Stack>
            </WishlistProvider>
          </CartProvider>
        </CatalogProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
