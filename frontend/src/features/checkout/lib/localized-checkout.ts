import type { Translator } from "@/shared/i18n/translate";
import type {
  DeliveryMethodId,
  PaymentMethodId,
} from "@/features/checkout/types/checkout.types";
import {
  DELIVERY_METHODS,
  getDeliveryMethod,
  type DeliveryMethod,
} from "@/features/checkout/constants/delivery-methods";
import {
  PAYMENT_METHODS,
  getPaymentMethod,
  type PaymentMethod,
} from "@/features/checkout/constants/payment-methods";

export function getLocalizedDeliveryMethods(t: Translator): DeliveryMethod[] {
  return DELIVERY_METHODS.map((method) => ({
    ...method,
    label: t(method.labelKey),
    description: t(method.descriptionKey),
  }));
}

export function getLocalizedDeliveryMethod(
  id: DeliveryMethodId,
  t: Translator,
): DeliveryMethod {
  const method = getDeliveryMethod(id);
  return {
    ...method,
    label: t(method.labelKey),
    description: t(method.descriptionKey),
  };
}

export function getLocalizedPaymentMethods(t: Translator): PaymentMethod[] {
  return PAYMENT_METHODS.map((method) => ({
    id: method.id,
    label: t(method.labelKey),
    description: t(method.descriptionKey),
  }));
}

export function getLocalizedPaymentMethod(
  id: PaymentMethodId,
  t: Translator,
): PaymentMethod {
  const method = getPaymentMethod(id);
  return {
    id: method.id,
    label: t(method.labelKey),
    description: t(method.descriptionKey),
  };
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
