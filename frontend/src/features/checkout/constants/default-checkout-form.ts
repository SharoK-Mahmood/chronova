import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { EMPTY_REGIONAL_ADDRESS } from "@/shared/lib/address/regional-address";

export const DEFAULT_CHECKOUT_FORM: CheckoutFormData = {
  contact: {
    email: "",
    phone: "",
  },
  shippingAddress: { ...EMPTY_REGIONAL_ADDRESS },
  deliveryMethodId: "standard",
  paymentMethodId: "card",
  cardDetails: {
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  },
  paypalEmail: "",
  bankAcknowledged: false,
};
