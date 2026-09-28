import type {
  CardPaymentDetails,
  CheckoutFormData,
} from "@/features/checkout/types/checkout.types";
import { EMPTY_REGIONAL_ADDRESS } from "@/shared/lib/address/regional-address";

export const EMPTY_CARD_PAYMENT: CardPaymentDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export const DEFAULT_CHECKOUT_FORM: CheckoutFormData = {
  shippingAddress: { ...EMPTY_REGIONAL_ADDRESS },
  deliveryMethodId: "standard",
  paymentMethodId: "cod",
  cardPayment: { ...EMPTY_CARD_PAYMENT },
};
