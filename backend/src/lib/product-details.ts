import type { ProductCategory, ProductDetails } from "../types/product-details.js";

export type { ProductCategory, ProductDetails };

export const EMPTY_PRODUCT_DETAILS: ProductDetails = {
  case: {},
  movement: {},
  hands: {},
  care: "",
  giftWrapping: "",
  shippingReturns: "",
};

export function parseProductDetails(raw: string | null | undefined): ProductDetails {
  if (!raw) {
    return { ...EMPTY_PRODUCT_DETAILS, case: {}, movement: {}, hands: {} };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProductDetails>;
    return {
      case: { ...(parsed.case ?? {}) },
      movement: { ...(parsed.movement ?? {}) },
      hands: { ...(parsed.hands ?? {}) },
      care: typeof parsed.care === "string" ? parsed.care : "",
      giftWrapping:
        typeof parsed.giftWrapping === "string" ? parsed.giftWrapping : "",
      shippingReturns:
        typeof parsed.shippingReturns === "string"
          ? parsed.shippingReturns
          : "",
    };
  } catch {
    return { ...EMPTY_PRODUCT_DETAILS, case: {}, movement: {}, hands: {} };
  }
}

function cleanRecord(record: Record<string, string | undefined> | undefined) {
  if (!record) {
    return {};
  }

  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    const trimmed = value?.trim();
    if (trimmed) {
      next[key] = trimmed;
    }
  }
  return next;
}

export function normalizeProductDetails(input: unknown): ProductDetails {
  const parsed =
    input && typeof input === "object"
      ? (input as Partial<ProductDetails>)
      : {};

  return {
    case: cleanRecord(parsed.case as Record<string, string | undefined>),
    movement: cleanRecord(
      parsed.movement as Record<string, string | undefined>,
    ),
    hands: cleanRecord(parsed.hands as Record<string, string | undefined>),
    care: typeof parsed.care === "string" ? parsed.care.trim() : "",
    giftWrapping:
      typeof parsed.giftWrapping === "string" ? parsed.giftWrapping.trim() : "",
    shippingReturns:
      typeof parsed.shippingReturns === "string"
        ? parsed.shippingReturns.trim()
        : "",
  };
}

export function serializeProductDetails(details: ProductDetails): string {
  return JSON.stringify(normalizeProductDetails(details));
}

export function hasAnyProductDetails(details: ProductDetails): boolean {
  return (
    Object.keys(details.case).length > 0 ||
    Object.keys(details.movement).length > 0 ||
    Object.keys(details.hands).length > 0 ||
    Boolean(details.care) ||
    Boolean(details.giftWrapping) ||
    Boolean(details.shippingReturns)
  );
}
