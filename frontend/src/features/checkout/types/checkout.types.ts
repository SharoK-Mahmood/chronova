export type ContactInformation = {
  email: string;
  phone: string;
};

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type DeliveryMethodId = "standard" | "express" | "white-glove";

export type PaymentMethodId = "card" | "paypal" | "bank-transfer";

export type CardDetails = {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type CheckoutFormData = {
  contact: ContactInformation;
  shippingAddress: ShippingAddress;
  deliveryMethodId: DeliveryMethodId;
  paymentMethodId: PaymentMethodId;
  cardDetails: CardDetails;
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
  paymentMethodId: PaymentMethodId;
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
