"use client";

import type { ReactNode } from "react";

import { AccountSettingsProvider } from "@/features/account";
import { CartDrawer, CartProvider } from "@/features/cart";
import { CurrencyProvider } from "@/features/currency";
import { WishlistProvider } from "@/features/wishlist";
import { RouterDebugProbe } from "@/shared/components/debug/RouterDebugProbe";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <CurrencyProvider>
      <AccountSettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <RouterDebugProbe />
            {children}
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </AccountSettingsProvider>
    </CurrencyProvider>
  );
}
