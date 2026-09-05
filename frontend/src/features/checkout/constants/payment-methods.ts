import type {
  CheckoutFormData,
  PaymentMethodId,
  PlacedOrder,
} from "@/features/checkout/types/checkout.types";

export type PaymentMethodDefinition = {
  id: PaymentMethodId;
  labelKey: string;
  descriptionKey: string;
  /** i18n key for the primary submit CTA when this method is selected. */
  submitLabelKey: string;
  orderStatus: PlacedOrder["status"];
  validate: (form: CheckoutFormData) => string | null;
  formatPaymentLabel: (form: CheckoutFormData, localizedLabel: string) => string;
};

export const PAYMENT_METHODS: PaymentMethodDefinition[] = [
  {
    id: "cod",
    labelKey: "checkout.paymentMethods.cod",
    descriptionKey: "checkout.paymentMethods.codDesc",
    submitLabelKey: "checkout.placeOrder",
    orderStatus: "confirmed",
    validate: () => null,
    formatPaymentLabel: (_form, label) => label,
  },
];

export function getPaymentMethod(
  id: PaymentMethodId,
): PaymentMethodDefinition {
  return (
    PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0]
  );
}

/** @deprecated Use PaymentMethodDefinition; kept for callers expecting label fields. */
export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
};
