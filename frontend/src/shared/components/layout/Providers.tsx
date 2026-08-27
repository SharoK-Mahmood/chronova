"use client";

import type { ReactNode } from "react";

import { AccountSettingsProvider } from "@/features/account";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartDrawer, CartProvider } from "@/features/cart";
import { CurrencyProvider } from "@/features/currency";
import { ProductCatalogProvider } from "@/features/products/context/ProductCatalogProvider";
import { WishlistProvider } from "@/features/wishlist";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
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
