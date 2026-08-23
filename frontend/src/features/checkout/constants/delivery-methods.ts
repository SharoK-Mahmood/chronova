import type { DeliveryMethodId } from "@/features/checkout/types/checkout.types";

export type DeliveryMethod = {
  id: DeliveryMethodId;
  label: string;
  description: string;
  shippingUsd: number;
  minDays: number;
  maxDays: number;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "Insured courier with signature on arrival.",
    shippingUsd: 0,
    minDays: 5,
    maxDays: 7,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "Priority handling and next-flight dispatch.",
    shippingUsd: 45,
    minDays: 2,
    maxDays: 3,
  },
  {
    id: "white-glove",
    label: "White glove service",
    description: "Personal concierge delivery by appointment.",
    shippingUsd: 120,
    minDays: 1,
    maxDays: 2,
  },
];

export function getDeliveryMethod(id: DeliveryMethodId): DeliveryMethod {
  return DELIVERY_METHODS.find((method) => method.id === id) ?? DELIVERY_METHODS[0];
}
