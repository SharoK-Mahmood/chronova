export type ProductCategory = "men" | "women" | "unisex";

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

export const EMPTY_PRODUCT_DETAILS: ProductDetails = {
  case: {},
  movement: {},
  hands: {},
  care: "",
  giftWrapping: "",
  shippingReturns: "",
};

export const CASE_SPEC_FIELDS = [
    { key: "dimensions", labelKey: "products.specs.dimensions" },
  { key: "material", labelKey: "products.specs.material" },
  { key: "crown", labelKey: "products.specs.crown" },
  { key: "waterResistance", labelKey: "products.specs.waterResistance" },
  { key: "glass", labelKey: "products.specs.glass" },
  { key: "caseback", labelKey: "products.specs.caseback" },
  { key: "thickness", labelKey: "products.specs.thickness" },
] as const;

export const MOVEMENT_SPEC_FIELDS = [
  { key: "type", labelKey: "products.specs.movementType" },
  { key: "caliber", labelKey: "products.specs.caliber" },
  { key: "functions", labelKey: "products.specs.functions" },
  { key: "components", labelKey: "products.specs.components" },
  { key: "frequency", labelKey: "products.specs.frequency" },
  { key: "powerReserve", labelKey: "products.specs.powerReserve" },
  { key: "jewels", labelKey: "products.specs.jewels" },
] as const;

export const HANDS_SPEC_FIELDS = [
  { key: "hoursMinutes", labelKey: "products.specs.hoursMinutes" },
  { key: "seconds", labelKey: "products.specs.seconds" },
  { key: "finishing", labelKey: "products.specs.finishing" },
] as const;

export function normalizeProductDetails(
  details?: Partial<ProductDetails> | null,
): ProductDetails {
  return {
    case: { ...(details?.case ?? {}) },
    movement: { ...(details?.movement ?? {}) },
    hands: { ...(details?.hands ?? {}) },
    care: details?.care ?? "",
    giftWrapping: details?.giftWrapping ?? "",
    shippingReturns: details?.shippingReturns ?? "",
  };
}

export function hasAnyProductDetails(details?: ProductDetails | null): boolean {
  if (!details) {
    return false;
  }

  return (
    Object.values(details.case).some(Boolean) ||
    Object.values(details.movement).some(Boolean) ||
    Object.values(details.hands).some(Boolean) ||
    Boolean(details.care?.trim()) ||
    Boolean(details.giftWrapping?.trim()) ||
    Boolean(details.shippingReturns?.trim())
  );
}
