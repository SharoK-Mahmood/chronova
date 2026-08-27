import type { Translator } from "@/shared/i18n/translate";
import { getPaymentMethod } from "@/features/checkout/constants/payment-methods";
import {
  getLocalizedDeliveryMethod,
  getLocalizedPaymentMethod,
} from "@/features/checkout/lib/localized-checkout";
import { estimateDelivery } from "@/features/checkout/lib/estimate-delivery";
import { generateOrderNumber } from "@/features/checkout/lib/generate-order-number";
import type {
  CheckoutFormData,
  OrderLineItem,
  PlacedOrder,
} from "@/features/checkout/types/checkout.types";

type BuildPlacedOrderInput = {
  form: CheckoutFormData;
  lineItems: OrderLineItem[];
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  currency: PlacedOrder["currency"];
  t: Translator;
};

/** Builds a persistable order from validated checkout state (SRP). */
export function buildPlacedOrder({
  form,
  lineItems,
  subtotalUsd,
  shippingUsd,
  totalUsd,
  currency,
  t,
}: BuildPlacedOrderInput): PlacedOrder {
  const paymentDef = getPaymentMethod(form.paymentMethodId);
  const paymentMethod = getLocalizedPaymentMethod(form.paymentMethodId, t);
  const localizedDelivery = getLocalizedDeliveryMethod(
    form.deliveryMethodId,
    t,
  );
  const estimatedDelivery = estimateDelivery(localizedDelivery);

  return {
    orderNumber: generateOrderNumber(),
    placedAt: new Date().toISOString(),
    contact: form.contact,
    shippingAddress: form.shippingAddress,
    deliveryMethodId: form.deliveryMethodId,
    deliveryLabel: localizedDelivery.label,
    paymentMethodId: form.paymentMethodId,
    paymentLabel: paymentDef.formatPaymentLabel(form, paymentMethod.label),
    lineItems,
    subtotalUsd,
    shippingUsd,
    totalUsd,
    currency,
    estimatedDelivery,
    status: paymentDef.orderStatus,
  };
}

export function getPaymentSubmitLabelKey(
  paymentMethodId: CheckoutFormData["paymentMethodId"],
): string {
  return getPaymentMethod(paymentMethodId).submitLabelKey;
}
