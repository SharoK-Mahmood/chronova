import type { Metadata } from "next";

import { WishlistContent } from "@/features/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your saved Chronova watches.",
};

export default function WishlistPage() {
  return <WishlistContent />;
}
