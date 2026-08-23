export type CheckoutStep = "shipping" | "payment" | "review";

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutDraft = {
  step: CheckoutStep;
  shippingAddress?: ShippingAddress;
};
