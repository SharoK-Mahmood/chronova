"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

import { env } from "@/config/env";
import { AccountSettingsProvider } from "@/features/account";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartDrawer, CartProvider } from "@/features/cart";
import { CurrencyProvider } from "@/features/currency";
import { ProductCatalogProvider } from "@/features/products/context/ProductCatalogProvider";
import { WishlistProvider } from "@/features/wishlist";

type ProvidersProps = {
  children: ReactNode;
};

function AppProviders({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <AccountSettingsProvider>
          <ProductCatalogProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <CartDrawer />
              </WishlistProvider>
            </CartProvider>
          </ProductCatalogProvider>
        </AccountSettingsProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  if (!env.googleClientId) {
    return <AppProviders>{children}</AppProviders>;
  }

  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <AppProviders>{children}</AppProviders>
    </GoogleOAuthProvider>
  );
}
