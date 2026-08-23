import type { Metadata } from "next";

import { EmptyCart } from "@/features/cart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your Chronova cart.",
};

export default function CartPage() {
  return <EmptyCart />;
}
