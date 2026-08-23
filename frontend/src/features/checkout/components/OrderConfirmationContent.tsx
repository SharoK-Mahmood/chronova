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

type OrderConfirmationContentProps = {
  orderNumber: string;
};

function formatAddress(order: PlacedOrder): string {
  const { shippingAddress } = order;
  const lines = [
    shippingAddress.fullName,
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`,
    shippingAddress.country,
  ].filter(Boolean);

  return lines.join("\n");
}

export function OrderConfirmationContent({
  orderNumber,
}: OrderConfirmationContentProps) {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOrder(getOrderByNumber(orderNumber));
    setIsHydrated(true);
  }, [orderNumber]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">Loading your confirmation...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Order not found
        </h1>
        <p className="mt-3 text-secondary">
          We couldn&apos;t locate order {orderNumber}. It may have expired from
          this device.
        </p>
        <Button href="/products" variant="accent" className="mt-8">
          Continue shopping
        </Button>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-8 w-8 text-accent"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              Thank you
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Order placed successfully
            </h1>
            <p className="mt-4 text-background/70">
              A confirmation has been sent to{" "}
              <span className="font-medium text-background">{order.contact.email}</span>
            </p>
            <p className="mt-6 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              Order {order.orderNumber}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                Products purchased
              </h2>
              <ul className="mt-6 divide-y divide-border">
                {order.lineItems.map((item) => (
                  <li key={item.slug} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div
                      className={cn(
                        "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl",
                        hasProductPhoto(item.imageUrl) ? "bg-white" : "bg-background",
                      )}
                    >
                      {hasProductPhoto(item.imageUrl) ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                        {item.brand}
                      </p>
                      <p className="font-medium">{item.name}</p>
                      {item.subtitle ? (
                        <p className="mt-1 text-sm text-secondary">{item.subtitle}</p>
                      ) : null}
                      <p className="mt-2 text-sm text-secondary">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium">
                      <Price amountUsd={item.unitPriceUsd * item.quantity} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                Shipping address
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-secondary">
                {formatAddress(order)}
              </p>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">
                Order details
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-secondary">Total amount</dt>
                  <dd className="mt-1 text-2xl font-semibold text-accent">
                    <Price amountUsd={order.totalUsd} />
                  </dd>
                </div>
                <div>
                  <dt className="text-secondary">Delivery method</dt>
                  <dd className="mt-1 font-medium">{order.deliveryLabel}</dd>
                </div>
                <div>
                  <dt className="text-secondary">Payment method</dt>
                  <dd className="mt-1 font-medium">{order.paymentLabel}</dd>
                </div>
                <div>
                  <dt className="text-secondary">Estimated delivery</dt>
                  <dd className="mt-1 font-medium">{order.estimatedDelivery.label}</dd>
                </div>
              </dl>

              <div className="mt-8 space-y-3">
                <Button
                  href={`/orders/${order.orderNumber}`}
                  variant="accent"
                  effect="luxury"
                  className="w-full"
                >
                  Track order
                </Button>
                <Button href="/products" variant="secondary" className="w-full">
                  Continue shopping
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
