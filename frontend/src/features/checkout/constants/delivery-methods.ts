import type { DeliveryMethodId } from "@/features/checkout/types/checkout.types";

export type DeliveryMethodDefinition = {
  id: DeliveryMethodId;
  labelKey: string;
  descriptionKey: string;
  shippingUsd: number;
  minDays: number;
  maxDays: number;
};

export const DELIVERY_METHODS: DeliveryMethodDefinition[] = [
  {
    id: "standard",
    labelKey: "checkout.deliveryMethods.standard",
    descriptionKey: "checkout.deliveryMethods.standardDesc",
    shippingUsd: 0,
    minDays: 5,
    maxDays: 7,
  },
  {
    id: "express",
    labelKey: "checkout.deliveryMethods.express",
    descriptionKey: "checkout.deliveryMethods.expressDesc",
    shippingUsd: 45,
    minDays: 2,
    maxDays: 3,
  },
  {
    id: "white-glove",
    labelKey: "checkout.deliveryMethods.whiteGlove",
    descriptionKey: "checkout.deliveryMethods.whiteGloveDesc",
    shippingUsd: 120,
    minDays: 1,
    maxDays: 2,
  },
];

export function getDeliveryMethod(
  id: DeliveryMethodId,
): DeliveryMethodDefinition {
  return (
    DELIVERY_METHODS.find((method) => method.id === id) ?? DELIVERY_METHODS[0]
  );
}

/** Localized view model used by UI. */
export type DeliveryMethod = DeliveryMethodDefinition & {
  label: string;
  description: string;
};
