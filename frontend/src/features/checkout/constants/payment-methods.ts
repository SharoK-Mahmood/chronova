import type { PaymentMethodId } from "@/features/checkout/types/checkout.types";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    label: "Credit or debit card",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Redirect to PayPal to complete payment",
  },
  {
    id: "bank-transfer",
    label: "Bank transfer",
    description: "Wire instructions sent after order confirmation",
  },
];

export function getPaymentMethod(id: PaymentMethodId): PaymentMethod {
  return PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0];
}
