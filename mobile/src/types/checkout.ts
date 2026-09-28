export type DeliveryMethodId = "standard" | "express" | "white-glove";
export type PaymentMethodId = "cod" | "card";
export type CurrencyCode = "USD" | "IQD";

export type CheckoutShippingAddress = {
  fullName: string;
  phone: string;
  countryCode: "iraq" | "kurdistan-region";
  governorate: string;
  city: string;
  district: string;
  street: string;
  details: string;
  postalCode: string;
};

export type CreateOrderInput = {
  contact: { email: string; phone: string };
  shippingAddress: CheckoutShippingAddress;
  deliveryMethodId: DeliveryMethodId;
  paymentMethodId: PaymentMethodId;
  paymentLabel?: string;
  items: Array<{ slug: string; quantity: number }>;
  currency: CurrencyCode;
};

export type PlacedOrder = {
  orderNumber: string;
  placedAt: string;
  contact: { email: string; phone: string };
  shippingAddress: CheckoutShippingAddress;
  deliveryMethodId: DeliveryMethodId;
  deliveryLabel: string;
  paymentMethodId: string;
  paymentLabel: string;
  lineItems: Array<{
    slug: string;
    name: string;
    brand: string;
    subtitle?: string;
    imageUrl: string;
    quantity: number;
    unitPriceUsd: number;
  }>;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  currency: CurrencyCode;
  estimatedDelivery: {
    from: string;
    to: string;
    label: string;
  };
  status: string;
};

export const DELIVERY_OPTIONS: Array<{
  id: DeliveryMethodId;
  label: string;
  hint: string;
  shippingUsd: number;
}> = [
  {
    id: "standard",
    label: "Standard delivery",
    hint: "5–7 business days · Free",
    shippingUsd: 0,
  },
  {
    id: "express",
    label: "Express delivery",
    hint: "2–3 business days · $45",
    shippingUsd: 45,
  },
  {
    id: "white-glove",
    label: "White-glove delivery",
    hint: "1–2 business days · $120",
    shippingUsd: 120,
  },
];

export const PAYMENT_OPTIONS: Array<{
  id: PaymentMethodId;
  label: string;
  hint: string;
}> = [
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when your watch arrives",
  },
  {
    id: "card",
    label: "Card payment",
    hint: "Pay securely online at confirmation",
  },
];

export const EMPTY_SHIPPING: CheckoutShippingAddress = {
  fullName: "",
  phone: "",
  countryCode: "kurdistan-region",
  governorate: "erbil",
  city: "",
  district: "",
  street: "",
  details: "",
  postalCode: "",
};
