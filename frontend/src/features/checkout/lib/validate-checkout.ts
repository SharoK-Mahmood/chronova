import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { getPaymentMethod } from "@/features/checkout/constants/payment-methods";

export type CheckoutValidationResult =
  | { ok: true }
  | { ok: false; errorKey: string; scrollTo?: string };

function isBlank(value: string): boolean {
  return !value.trim();
}

function validateInformation(
  form: CheckoutFormData,
): CheckoutValidationResult | null {
  const { contact, shippingAddress: a } = form;

  const complete =
    !isBlank(contact.email) &&
    !isBlank(contact.phone) &&
    !isBlank(a.fullName) &&
    !isBlank(a.phone) &&
    Boolean(a.countryCode) &&
    Boolean(a.governorate) &&
    !isBlank(a.city) &&
    !isBlank(a.district) &&
    !isBlank(a.street);

  if (!complete) {
    return {
      ok: false,
      errorKey: "checkout.informationError",
      scrollTo: "checkout-information",
    };
  }

  return null;
}

/** Single validation entry point — add field/method rules here, not in the page. */
export function validateCheckout(
  form: CheckoutFormData,
): CheckoutValidationResult {
  const informationError = validateInformation(form);
  if (informationError) {
    return informationError;
  }

  const paymentErrorKey = getPaymentMethod(form.paymentMethodId).validate(form);
  if (paymentErrorKey) {
    return {
      ok: false,
      errorKey: paymentErrorKey,
      scrollTo: "checkout-payment",
    };
  }

  return { ok: true };
}
