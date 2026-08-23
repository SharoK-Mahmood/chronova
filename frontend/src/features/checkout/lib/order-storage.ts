import type { PlacedOrder } from "@/features/checkout/types/checkout.types";

const ORDERS_STORAGE_KEY = "chronova.orders";

function readOrders(): PlacedOrder[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as PlacedOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: PlacedOrder[]): void {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function saveOrder(order: PlacedOrder): void {
  const orders = readOrders();
  writeOrders([order, ...orders.filter((entry) => entry.orderNumber !== order.orderNumber)]);
}

export function getOrderByNumber(orderNumber: string): PlacedOrder | null {
  return readOrders().find((order) => order.orderNumber === orderNumber) ?? null;
}

export function getAllOrders(): PlacedOrder[] {
  return readOrders();
}
