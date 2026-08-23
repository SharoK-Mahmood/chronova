"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getOrderByNumber } from "@/features/checkout/lib/order-storage";
import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import { Price } from "@/features/currency";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

type OrderTrackingContentProps = {
  orderNumber: string;
};

const TRACKING_STEPS = [
  { key: "confirmed", label: "Order placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

function getStepIndex(status: PlacedOrder["status"]): number {
  return TRACKING_STEPS.findIndex((step) => step.key === status);
}

export function OrderTrackingContent({ orderNumber }: OrderTrackingContentProps) {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOrder(getOrderByNumber(orderNumber));
    setIsHydrated(true);
  }, [orderNumber]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">Loading order status...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Order not found</h1>
        <p className="mt-3 text-secondary">
          We couldn&apos;t find order {orderNumber} on this device.
        </p>
        <Button href="/products" variant="accent" className="mt-8">
          Continue shopping
        </Button>
      </Container>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            Order tracking
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {order.orderNumber}
          </h1>
          <p className="mt-3 text-background/70">
            Estimated delivery: {order.estimatedDelivery.label}
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                Delivery progress
              </h2>
              <ol className="mt-8 space-y-0">
                {TRACKING_STEPS.map((step, index) => {
                  const isComplete = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                      {index < TRACKING_STEPS.length - 1 ? (
                        <span
                          className={cn(
                            "absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5",
                            isComplete ? "bg-accent" : "bg-border",
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold",
                          isComplete
                            ? "border-accent bg-accent text-primary"
                            : "border-border bg-card text-secondary",
                        )}
                      >
                        {isComplete ? "✓" : index + 1}
                      </span>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isCurrent ? "text-accent" : isComplete ? "text-foreground" : "text-secondary",
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent ? (
                          <p className="mt-1 text-sm text-secondary">
                            Your order is currently at this stage.
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">Items</h2>
              <ul className="mt-6 divide-y divide-border">
                {order.lineItems.map((item) => (
                  <li key={item.slug} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div
                      className={cn(
                        "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl",
                        hasProductPhoto(item.imageUrl) ? "bg-white" : "bg-background",
                      )}
                    >
                      {hasProductPhoto(item.imageUrl) ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-secondary">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      <Price amountUsd={item.unitPriceUsd * item.quantity} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold tracking-tight">Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Subtotal</dt>
                <dd className="font-medium">
                  <Price amountUsd={order.subtotalUsd} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Shipping</dt>
                <dd className="font-medium">
                  {order.shippingUsd === 0 ? (
                    "Complimentary"
                  ) : (
                    <Price amountUsd={order.shippingUsd} />
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold text-accent">
                  <Price amountUsd={order.totalUsd} />
                </dd>
              </div>
            </dl>
            <Button
              href={`/checkout/confirmation/${order.orderNumber}`}
              variant="secondary"
              className="mt-6 w-full"
            >
              View confirmation
            </Button>
          </aside>
        </div>
      </Container>
    </>
  );
}
