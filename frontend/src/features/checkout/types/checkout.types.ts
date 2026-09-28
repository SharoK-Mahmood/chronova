import type { RegionalAddress } from "@/shared/lib/address/regional-address";

export type ContactInformation = {
  email: string;
  phone: string;
};

export type ShippingAddress = RegionalAddress;

export type DeliveryMethodId = "standard" | "express" | "white-glove";

export type PaymentMethodId = "cod" | "card";

/** Payment method ids that may appear on stored orders (including legacy). */
export type StoredPaymentMethodId =
  | PaymentMethodId
  | "paypal"
  | "bank-transfer";

export type CardPaymentDetails = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

/** Editable checkout fields — contact comes from the signed-in account. */
export type CheckoutFormData = {
  shippingAddress: ShippingAddress;
  deliveryMethodId: DeliveryMethodId;
  paymentMethodId: PaymentMethodId;
  cardPayment: CardPaymentDetails;
};

export type OrderLineItem = {
  slug: string;
  name: string;
  brand: string;
  subtitle?: string;
  imageUrl: string;
  quantity: number;
  unitPriceUsd: number;
};

export type PlacedOrder = {
  orderNumber: string;
  placedAt: string;
  contact: ContactInformation;
  shippingAddress: ShippingAddress;
  deliveryMethodId: DeliveryMethodId;
  deliveryLabel: string;
  paymentMethodId: StoredPaymentMethodId;
  paymentLabel: string;
  lineItems: OrderLineItem[];
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  currency: "USD" | "IQD";
  estimatedDelivery: {
    from: string;
    to: string;
    label: string;
  };
  status: "confirmed" | "processing" | "shipped" | "delivered";
};
