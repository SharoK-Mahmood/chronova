import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import { apiClient } from "@/shared/lib/api/client";

export type CreateOrderInput = {
  contact: PlacedOrder["contact"];
  shippingAddress: PlacedOrder["shippingAddress"];
  deliveryMethodId: PlacedOrder["deliveryMethodId"];
  paymentMethodId: PlacedOrder["paymentMethodId"];
  paymentLabel?: string;
  paypalEmail?: string;
  items: Array<{ slug: string; quantity: number }>;
  currency: PlacedOrder["currency"];
};

export type AdminOverview = {
  products: number;
  orders: number;
  ordersByStatus: Record<PlacedOrder["status"], number>;
};

export async function createOrder(input: CreateOrderInput): Promise<PlacedOrder> {
  return apiClient<PlacedOrder>("/orders", {
    method: "POST",
    body: input,
  });
}

export async function listOrders(): Promise<PlacedOrder[]> {
  return apiClient<PlacedOrder[]>("/orders");
}

export async function getOrderByNumber(orderNumber: string): Promise<PlacedOrder> {
  return apiClient<PlacedOrder>(`/orders/${encodeURIComponent(orderNumber)}`);
}

export async function updateOrderStatus(
  orderNumber: string,
  status: PlacedOrder["status"],
): Promise<PlacedOrder> {
  return apiClient<PlacedOrder>(
    `/orders/${encodeURIComponent(orderNumber)}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return apiClient<AdminOverview>("/admin/overview");
}
