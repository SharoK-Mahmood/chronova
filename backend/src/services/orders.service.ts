import { z } from "zod";

import {
  estimateDelivery,
  generateOrderNumber,
  getDeliveryMethod,
  getPaymentMethod,
  ORDER_STATUSES,
  type OrderStatus,
} from "../lib/commerce.js";
import { badRequest, forbidden, notFound } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import type { AuthUser } from "../middleware/auth.js";

const addressSchema = z.object({
  fullName: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  countryCode: z.string().trim().min(1),
  governorate: z.string().trim().min(1),
  city: z.string().trim().min(1),
  district: z.string().trim().optional().default(""),
  street: z.string().trim().min(1),
  details: z.string().trim().optional().default(""),
  postalCode: z.string().trim().optional().default(""),
});

const createOrderSchema = z.object({
  contact: z.object({
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
  }),
  shippingAddress: addressSchema,
  deliveryMethodId: z.enum(["standard", "express", "white-glove"]),
  paymentMethodId: z.enum(["card", "paypal", "bank-transfer"]),
  paymentLabel: z.string().trim().min(1).optional(),
  paypalEmail: z.string().trim().email().optional(),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Order must include at least one item"),
  currency: z.enum(["USD", "IQD"]).default("USD"),
});

const statusSchema = z.object({
  status: z.enum(["confirmed", "processing", "shipped", "delivered"]),
});

export type PlacedOrderResponse = {
  orderNumber: string;
  placedAt: string;
  contact: {
    email: string;
    phone: string;
  };
  shippingAddress: z.infer<typeof addressSchema>;
  deliveryMethodId: "standard" | "express" | "white-glove";
  deliveryLabel: string;
  paymentMethodId: "card" | "paypal" | "bank-transfer";
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
  currency: "USD" | "IQD";
  estimatedDelivery: {
    from: string;
    to: string;
    label: string;
  };
  status: OrderStatus;
};

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}

function toOrderResponse(order: {
  orderNumber: string;
  placedAt: Date;
  contact: string;
  shippingAddress: string;
  deliveryMethodId: string;
  deliveryLabel: string;
  paymentMethodId: string;
  paymentLabel: string;
  lineItems: string;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  currency: string;
  estimatedDelivery: string;
  status: string;
}): PlacedOrderResponse {
  return {
    orderNumber: order.orderNumber,
    placedAt: order.placedAt.toISOString(),
    contact: parseJson(order.contact),
    shippingAddress: parseJson(order.shippingAddress),
    deliveryMethodId: order.deliveryMethodId as PlacedOrderResponse["deliveryMethodId"],
    deliveryLabel: order.deliveryLabel,
    paymentMethodId: order.paymentMethodId as PlacedOrderResponse["paymentMethodId"],
    paymentLabel: order.paymentLabel,
    lineItems: parseJson(order.lineItems),
    subtotalUsd: order.subtotalUsd,
    shippingUsd: order.shippingUsd,
    totalUsd: order.totalUsd,
    currency: order.currency === "IQD" ? "IQD" : "USD",
    estimatedDelivery: parseJson(order.estimatedDelivery),
    status: ORDER_STATUSES.includes(order.status as OrderStatus)
      ? (order.status as OrderStatus)
      : "confirmed",
  };
}

export async function createOrder(user: AuthUser, input: unknown) {
  const data = createOrderSchema.parse(input);
  const delivery = getDeliveryMethod(data.deliveryMethodId);
  const payment = getPaymentMethod(data.paymentMethodId);

  if (!delivery || !payment) {
    throw badRequest("Invalid delivery or payment method");
  }

  const slugs = data.items.map((item) => item.slug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
  });
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));

  const lineItems = data.items.map((item) => {
    const product = productsBySlug.get(item.slug);

    if (!product) {
      throw badRequest(`Product not found: ${item.slug}`, "PRODUCT_NOT_FOUND");
    }

    if (!product.inStock) {
      throw badRequest(`${product.name} is currently unavailable`, "OUT_OF_STOCK");
    }

    return {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      subtitle: product.subtitle ?? undefined,
      imageUrl: product.imageUrl,
      quantity: item.quantity,
      unitPriceUsd: product.price,
    };
  });

  const subtotalUsd = lineItems.reduce(
    (total, item) => total + item.unitPriceUsd * item.quantity,
    0,
  );
  const shippingUsd = delivery.shippingUsd;
  const totalUsd = subtotalUsd + shippingUsd;

  let paymentLabel = data.paymentLabel ?? payment.label;
  if (data.paymentMethodId === "paypal" && data.paypalEmail) {
    paymentLabel = `${payment.label} (${data.paypalEmail})`;
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      contact: JSON.stringify(data.contact),
      shippingAddress: JSON.stringify(data.shippingAddress),
      deliveryMethodId: delivery.id,
      deliveryLabel: delivery.label,
      paymentMethodId: payment.id,
      paymentLabel,
      lineItems: JSON.stringify(lineItems),
      subtotalUsd,
      shippingUsd,
      totalUsd,
      currency: data.currency,
      estimatedDelivery: JSON.stringify(
        estimateDelivery(delivery.minDays, delivery.maxDays),
      ),
      status: payment.orderStatus,
    },
  });

  return toOrderResponse(order);
}

export async function listOrders(user: AuthUser) {
  const orders = await prisma.order.findMany({
    where: user.role === "admin" ? undefined : { userId: user.id },
    orderBy: { placedAt: "desc" },
  });

  return orders.map(toOrderResponse);
}

export async function getOrderByNumber(user: AuthUser, orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) {
    throw notFound("Order");
  }

  if (user.role !== "admin" && order.userId !== user.id) {
    throw forbidden("You cannot view this order");
  }

  return toOrderResponse(order);
}

export async function updateOrderStatus(orderNumber: string, input: unknown) {
  const { status } = statusSchema.parse(input);

  const existing = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!existing) {
    throw notFound("Order");
  }

  const order = await prisma.order.update({
    where: { orderNumber },
    data: { status },
  });

  return toOrderResponse(order);
}

export async function getOrderCounts() {
  const [products, orders, grouped] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const ordersByStatus = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderStatus, number>;

  for (const row of grouped) {
    if (ORDER_STATUSES.includes(row.status as OrderStatus)) {
      ordersByStatus[row.status as OrderStatus] = row._count._all;
    }
  }

  return { products, orders, ordersByStatus };
}
