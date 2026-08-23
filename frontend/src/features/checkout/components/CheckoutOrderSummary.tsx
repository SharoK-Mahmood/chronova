"use client";

import Image from "next/image";

import type {
  DeliveryMethodId,
  OrderLineItem,
} from "@/features/checkout/types/checkout.types";
import {
  calculateSubtotalUsd,
} from "@/features/checkout/lib/build-order-line-items";
import { getLocalizedDeliveryMethod } from "@/features/checkout/lib/localized-checkout";
import { Price, useCurrency } from "@/features/currency";
import { useTranslation } from "@/shared/i18n";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

type CheckoutOrderSummaryProps = {
  lineItems: OrderLineItem[];
  deliveryMethodId: DeliveryMethodId;
  className?: string;
};

export function CheckoutOrderSummary({
  lineItems,
  deliveryMethodId,
  className,
}: CheckoutOrderSummaryProps) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const deliveryMethod = getLocalizedDeliveryMethod(deliveryMethodId, t);
  const subtotalUsd = calculateSubtotalUsd(lineItems);
  const shippingUsd = deliveryMethod.shippingUsd;
  const totalUsd = subtotalUsd + shippingUsd;
  const itemCount = lineItems.reduce((total, item) => total + item.quantity, 0);
  const currencyLabel =
    currency === "USD" ? t("common.usd") : t("common.iqd");

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        {t("checkout.orderSummary")}
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">
        {itemCount}{" "}
        {itemCount === 1 ? t("common.piece") : t("common.pieces")}
      </h2>

      <ul className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
        {lineItems.map((item) => (
          <li key={item.slug} className="flex gap-3">
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
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-6 w-6 rounded-full border border-border bg-card" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                {item.brand}
              </p>
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="mt-1 text-xs text-secondary">
                {t("common.qty")} {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium">
              <Price amountUsd={item.unitPriceUsd * item.quantity} />
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-secondary">{t("cart.subtotal")}</dt>
          <dd className="font-medium">
            <Price amountUsd={subtotalUsd} />
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-secondary">{t("cart.shipping")}</dt>
          <dd className="font-medium">
            {shippingUsd === 0 ? (
              <span className="text-accent">{t("common.complimentary")}</span>
            ) : (
              <Price amountUsd={shippingUsd} />
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-base">
          <dt className="font-semibold">{t("checkout.total")}</dt>
          <dd className="font-semibold text-accent">
            <Price amountUsd={totalUsd} />
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-secondary">
        {t("common.pricesIn", { currency: currencyLabel })}{" "}
        {t("common.dutiesNote")}
      </p>
    </aside>
  );
}

export function useCheckoutTotals(
  lineItems: OrderLineItem[],
  deliveryMethodId: DeliveryMethodId,
) {
  const { t } = useTranslation();
  const deliveryMethod = getLocalizedDeliveryMethod(deliveryMethodId, t);
  const subtotalUsd = calculateSubtotalUsd(lineItems);
  const shippingUsd = deliveryMethod.shippingUsd;

  return {
    subtotalUsd,
    shippingUsd,
    totalUsd: subtotalUsd + shippingUsd,
    deliveryMethod,
  };
}
