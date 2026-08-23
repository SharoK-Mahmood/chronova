export const SITE = {
  name: "Chronova",
  description: "Premium watches and timepieces for every moment.",
  tagline: "Time, refined.",
} as const;

export const MAIN_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Watches" },
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/brands", label: "Brands" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/sale", label: "Sale", highlight: true },
] as const;

export type UtilityNavIcon = "search" | "wishlist" | "cart" | "account";

export const UTILITY_NAV_LINKS: ReadonlyArray<{
  href: string;
  label: string;
  icon: UtilityNavIcon;
}> = [
  { href: "/search", label: "Search", icon: "search" },
  { href: "/wishlist", label: "Wishlist", icon: "wishlist" },
  { href: "/cart", label: "Cart", icon: "cart" },
  { href: "/account", label: "Account", icon: "account" },
];
