import type { Metadata } from "next";

import { CartContent } from "@/features/cart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your Chronova cart.",
};

export default function CartPage() {
  return <CartContent />;
}
