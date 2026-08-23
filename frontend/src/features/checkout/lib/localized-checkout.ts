import type { Translator } from "@/shared/i18n/translate";
import type { DeliveryMethodId, PaymentMethodId } from "@/features/checkout/types/checkout.types";
import { DELIVERY_METHODS, type DeliveryMethod } from "@/features/checkout/constants/delivery-methods";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/checkout/constants/payment-methods";

const DELIVERY_MESSAGE_KEYS: Record<
  DeliveryMethodId,
  { label: string; description: string }
> = {
  standard: {
    label: "checkout.deliveryMethods.standard",
    description: "checkout.deliveryMethods.standardDesc",
  },
  express: {
    label: "checkout.deliveryMethods.express",
    description: "checkout.deliveryMethods.expressDesc",
  },
  "white-glove": {
    label: "checkout.deliveryMethods.whiteGlove",
    description: "checkout.deliveryMethods.whiteGloveDesc",
  },
};

const PAYMENT_MESSAGE_KEYS: Record<
  PaymentMethodId,
  { label: string; description: string }
> = {
  card: {
    label: "checkout.paymentMethods.card",
    description: "checkout.paymentMethods.cardDesc",
  },
  paypal: {
    label: "checkout.paymentMethods.paypal",
    description: "checkout.paymentMethods.paypalDesc",
  },
  "bank-transfer": {
    label: "checkout.paymentMethods.bank",
    description: "checkout.paymentMethods.bankDesc",
  },
};

export function getLocalizedDeliveryMethods(t: Translator): DeliveryMethod[] {
  return DELIVERY_METHODS.map((method) => ({
    ...method,
    label: t(DELIVERY_MESSAGE_KEYS[method.id].label),
    description: t(DELIVERY_MESSAGE_KEYS[method.id].description),
  }));
}

export function getLocalizedDeliveryMethod(
  id: DeliveryMethodId,
  t: Translator,
): DeliveryMethod {
  return (
    getLocalizedDeliveryMethods(t).find((method) => method.id === id) ??
    getLocalizedDeliveryMethods(t)[0]
  );
}

export function getLocalizedPaymentMethods(t: Translator): PaymentMethod[] {
  return PAYMENT_METHODS.map((method) => ({
    ...method,
    label: t(PAYMENT_MESSAGE_KEYS[method.id].label),
    description: t(PAYMENT_MESSAGE_KEYS[method.id].description),
  }));
}

export function getLocalizedPaymentMethod(
  id: PaymentMethodId,
  t: Translator,
): PaymentMethod {
  return (
    getLocalizedPaymentMethods(t).find((method) => method.id === id) ??
    getLocalizedPaymentMethods(t)[0]
  );
}

export function formatBusinessDays(
  t: Translator,
  minDays: number,
  maxDays: number,
): string {
  if (minDays === maxDays) {
    return t("checkout.businessDay", { count: minDays });
  }

  return t("checkout.businessDays", { min: minDays, max: maxDays });
}
