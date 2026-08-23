export const SITE = {
  name: "Chronova",
  description: "Premium watches and timepieces for every moment.",
  tagline: "Time, refined.",
} as const;

export type NavLabelKey =
  | "nav.home"
  | "nav.watches"
  | "nav.men"
  | "nav.women"
  | "nav.brands"
  | "nav.newArrivals"
  | "nav.sale"
  | "nav.wishlist"
  | "nav.cart"
  | "nav.account";

export const MAIN_NAV_LINKS = [
  { href: "/", labelKey: "nav.home" as const },
  { href: "/products", labelKey: "nav.watches" as const },
  { href: "/men", labelKey: "nav.men" as const },
  { href: "/women", labelKey: "nav.women" as const },
  { href: "/brands", labelKey: "nav.brands" as const },
  { href: "/new-arrivals", labelKey: "nav.newArrivals" as const },
  { href: "/sale", labelKey: "nav.sale" as const, highlight: true },
] as const;

/** Links shown in the tablet header (full main nav, no overflow menu). */
export const TABLET_PRIMARY_NAV_HREFS = [
  "/",
  "/products",
  "/men",
  "/women",
  "/brands",
  "/new-arrivals",
  "/sale",
] as const;

export type UtilityNavIcon = "wishlist" | "cart" | "account";

export const UTILITY_NAV_LINKS: ReadonlyArray<{
  href: string;
  labelKey: NavLabelKey;
  icon: UtilityNavIcon;
}> = [
  { href: "/wishlist", labelKey: "nav.wishlist", icon: "wishlist" },
  { href: "/cart", labelKey: "nav.cart", icon: "cart" },
  { href: "/account", labelKey: "nav.account", icon: "account" },
];
