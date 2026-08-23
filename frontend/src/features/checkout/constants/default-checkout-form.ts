import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";

export const DEFAULT_CHECKOUT_FORM: CheckoutFormData = {
  contact: {
    email: "",
    phone: "",
  },
  shippingAddress: {
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  },
  deliveryMethodId: "standard",
  paymentMethodId: "card",
  cardDetails: {
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  },
};
