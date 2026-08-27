import type {
  CheckoutFormData,
  PaymentMethodId,
  PlacedOrder,
} from "@/features/checkout/types/checkout.types";
import { isCardDetailsComplete } from "@/features/checkout/lib/card-format";

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
    id: "card",
    labelKey: "checkout.paymentMethods.card",
    descriptionKey: "checkout.paymentMethods.cardDesc",
    submitLabelKey: "checkout.placeOrder",
    orderStatus: "confirmed",
    validate: (form) =>
      isCardDetailsComplete(form.cardDetails) ? null : "checkout.cardError",
    formatPaymentLabel: (_form, label) => label,
  },
  {
    id: "paypal",
    labelKey: "checkout.paymentMethods.paypal",
    descriptionKey: "checkout.paymentMethods.paypalDesc",
    submitLabelKey: "checkout.continuePayPal",
    orderStatus: "confirmed",
    validate: (form) =>
      form.paypalEmail.trim() ? null : "checkout.paypalError",
    formatPaymentLabel: (form, label) =>
      form.paypalEmail.trim()
        ? `${label} (${form.paypalEmail.trim()})`
        : label,
  },
  {
    id: "bank-transfer",
    labelKey: "checkout.paymentMethods.bank",
    descriptionKey: "checkout.paymentMethods.bankDesc",
    submitLabelKey: "checkout.confirmBankOrder",
    orderStatus: "processing",
    validate: (form) =>
      form.bankAcknowledged ? null : "checkout.bankError",
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
