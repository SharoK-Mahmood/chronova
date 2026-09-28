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

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function isBlank(value: string): boolean {
  return !value.trim();
}

function validateCardPayment(form: CheckoutFormData): string | null {
  const card = form.cardPayment;
  const number = digitsOnly(card.cardNumber);
  const expiry = card.expiry.trim();
  const cvc = digitsOnly(card.cvc);

  if (
    isBlank(card.cardholderName) ||
    number.length < 12 ||
    number.length > 19 ||
    !/^\d{2}\/\d{2}$/.test(expiry) ||
    cvc.length < 3 ||
    cvc.length > 4
  ) {
    return "checkout.cardPaymentError";
  }

  return null;
}

function formatCardPaymentLabel(
  form: CheckoutFormData,
  localizedLabel: string,
): string {
  const lastFour = digitsOnly(form.cardPayment.cardNumber).slice(-4);
  return lastFour ? `${localizedLabel} ···· ${lastFour}` : localizedLabel;
}

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
  {
    id: "card",
    labelKey: "checkout.paymentMethods.card",
    descriptionKey: "checkout.paymentMethods.cardDesc",
    submitLabelKey: "checkout.payOnline",
    orderStatus: "confirmed",
    validate: validateCardPayment,
    formatPaymentLabel: formatCardPaymentLabel,
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
