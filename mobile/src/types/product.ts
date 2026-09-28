export type CaseSpecs = {
  dimensions?: string;
  material?: string;
  crown?: string;
  waterResistance?: string;
  glass?: string;
  caseback?: string;
  thickness?: string;
};

export type MovementSpecs = {
  type?: string;
  caliber?: string;
  functions?: string;
  components?: string;
  frequency?: string;
  powerReserve?: string;
  jewels?: string;
};

export type HandsSpecs = {
  hoursMinutes?: string;
  seconds?: string;
  finishing?: string;
};

export type ProductDetails = {
  case: CaseSpecs;
  movement: MovementSpecs;
  hands: HandsSpecs;
  care: string;
  giftWrapping: string;
  shippingReturns: string;
};

export type ProductCategory = "men" | "women" | "unisex";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageUrls?: string[];
  category: ProductCategory | string;
  inStock: boolean;
  brand: string;
  reference?: string;
  subtitle?: string;
  details?: ProductDetails | null;
  createdAt?: string;
};

export const CASE_SPEC_FIELDS = [
  { key: "dimensions" as const, label: "Dimensions" },
  { key: "material" as const, label: "Material" },
  { key: "crown" as const, label: "Crown" },
  { key: "waterResistance" as const, label: "Water resistance" },
  { key: "glass" as const, label: "Glass" },
  { key: "caseback" as const, label: "Caseback" },
  { key: "thickness" as const, label: "Thickness" },
];

export const MOVEMENT_SPEC_FIELDS = [
  { key: "type" as const, label: "Type" },
  { key: "caliber" as const, label: "Caliber" },
  { key: "functions" as const, label: "Functions" },
  { key: "components" as const, label: "Components" },
  { key: "frequency" as const, label: "Frequency" },
  { key: "powerReserve" as const, label: "Power reserve" },
  { key: "jewels" as const, label: "Jewels" },
];

export const HANDS_SPEC_FIELDS = [
  { key: "hoursMinutes" as const, label: "Hours / minutes" },
  { key: "seconds" as const, label: "Seconds" },
  { key: "finishing" as const, label: "Finishing" },
];

export function hasAnyProductDetails(details?: ProductDetails | null): boolean {
  if (!details) {
    return false;
  }
  return (
    Object.values(details.case ?? {}).some(Boolean) ||
    Object.values(details.movement ?? {}).some(Boolean) ||
    Object.values(details.hands ?? {}).some(Boolean) ||
    Boolean(details.care?.trim()) ||
    Boolean(details.giftWrapping?.trim()) ||
    Boolean(details.shippingReturns?.trim())
  );
}
