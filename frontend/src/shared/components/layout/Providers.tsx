"use client";

import type { ReactNode } from "react";

import { WishlistProvider } from "@/features/wishlist";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <WishlistProvider>{children}</WishlistProvider>;
}
