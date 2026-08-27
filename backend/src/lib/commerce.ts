export const DELIVERY_METHODS = [
  {
    id: "standard",
    label: "Standard delivery",
    shippingUsd: 0,
    minDays: 5,
    maxDays: 7,
  },
  {
    id: "express",
    label: "Express delivery",
    shippingUsd: 45,
    minDays: 2,
    maxDays: 3,
  },
  {
    id: "white-glove",
    label: "White-glove delivery",
    shippingUsd: 120,
    minDays: 1,
    maxDays: 2,
  },
] as const;

export const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Card",
    orderStatus: "confirmed",
  },
  {
    id: "paypal",
    label: "PayPal",
    orderStatus: "confirmed",
  },
  {
    id: "bank-transfer",
    label: "Bank transfer",
    orderStatus: "processing",
  },
] as const;

export type DeliveryMethodId = (typeof DELIVERY_METHODS)[number]["id"];
export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];
export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export const ORDER_STATUSES: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export function getDeliveryMethod(id: string) {
  return DELIVERY_METHODS.find((method) => method.id === id);
}

export function getPaymentMethod(id: string) {
  return PAYMENT_METHODS.find((method) => method.id === id);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CV-${timestamp.slice(-4)}${random}`;
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }

  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function estimateDelivery(minDays: number, maxDays: number, fromDate = new Date()) {
  const from = addBusinessDays(fromDate, minDays);
  const to = addBusinessDays(fromDate, maxDays);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    label:
      minDays === maxDays
        ? formatDate(from)
        : `${formatDate(from)} – ${formatDate(to)}`,
  };
}
