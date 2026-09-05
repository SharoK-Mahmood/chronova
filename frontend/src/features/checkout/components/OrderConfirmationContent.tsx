"use client";

import { useEffect, useState } from "react";

import { getOrderByNumber } from "@/features/checkout/services/orders.service";
import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import { Price } from "@/features/currency";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import { useTranslation } from "@/shared/i18n";
import {
  formatRegionalAddress,
  migrateToRegionalAddress,
} from "@/shared/lib/address/regional-address";
import { hasProductPhoto, resolveMediaUrl } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

type OrderConfirmationContentProps = {
  orderNumber: string;
};

export function OrderConfirmationContent({
  orderNumber,
}: OrderConfirmationContentProps) {
  const { t } = useTranslation();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void getOrderByNumber(orderNumber)
      .then((next) => {
        if (!cancelled) {
          setOrder(next);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">{t("common.loading")}</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("checkout.confirmation.notFound")}
        </h1>
        <p className="mt-3 text-secondary">
          {t("checkout.confirmation.notFoundDesc", { number: orderNumber })}
        </p>
        <Button href="/products" variant="accent" className="mt-8">
          {t("common.continueShopping")}
        </Button>
      </Container>
    );
  }

  const address = migrateToRegionalAddress(order.shippingAddress);
  const addressLines = address ? formatRegionalAddress(address, t) : [];

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
              {t("checkout.confirmation.thankYou")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("checkout.confirmation.success")}
            </h1>
            <p className="mt-4 text-background/70">
              {t("checkout.confirmation.sentTo", { email: order.contact.email })}
            </p>
            <p className="mt-6 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              {t("checkout.confirmation.order", { number: order.orderNumber })}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                {t("checkout.confirmation.products")}
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
                        <ProductImage
                          src={resolveMediaUrl(item.imageUrl)}
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
                        {t("common.qty")} {item.quantity}
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
                {t("checkout.confirmation.shippingAddress")}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-secondary">
                {addressLines.join("\n")}
              </p>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">
                {t("checkout.confirmation.orderDetails")}
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-secondary">{t("checkout.confirmation.totalAmount")}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-accent">
                    <Price amountUsd={order.totalUsd} />
                  </dd>
                </div>
                <div>
                  <dt className="text-secondary">{t("checkout.confirmation.deliveryMethod")}</dt>
                  <dd className="mt-1 font-medium">{order.deliveryLabel}</dd>
                </div>
                <div>
                  <dt className="text-secondary">{t("checkout.confirmation.paymentMethod")}</dt>
                  <dd className="mt-1 font-medium">{order.paymentLabel}</dd>
                </div>
                <div>
                  <dt className="text-secondary">{t("checkout.confirmation.estimatedDelivery")}</dt>
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
                  {t("checkout.confirmation.trackOrder")}
                </Button>
                <Button href="/products" variant="secondary" className="w-full">
                  {t("common.continueShopping")}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
