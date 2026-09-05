"use client";

import type { ReactNode } from "react";

import type {
  DeliveryMethodId,
  OrderLineItem,
} from "@/features/checkout/types/checkout.types";
import { calculateSubtotalUsd } from "@/features/checkout/lib/build-order-line-items";
import { getLocalizedDeliveryMethod } from "@/features/checkout/lib/localized-checkout";
import { Price, useCurrency } from "@/features/currency";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import { useTranslation } from "@/shared/i18n";
import { hasProductPhoto, resolveMediaUrl } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

type CheckoutOrderSummaryProps = {
  lineItems: OrderLineItem[];
  deliveryMethodId: DeliveryMethodId;
  className?: string;
  actions?: ReactNode;
};

export function CheckoutOrderSummary({
  lineItems,
  deliveryMethodId,
  className,
  actions,
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
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7",
        "lg:sticky lg:top-28 lg:min-h-[30rem]",
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

      <ul className="mt-6 space-y-4">
        {lineItems.map((item) => (
          <li key={item.slug} className="flex min-w-0 gap-3.5">
            <div
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl",
                hasProductPhoto(item.imageUrl) ? "bg-white" : "bg-background",
              )}
            >
              {hasProductPhoto(item.imageUrl) ? (
                <ProductImage
                  src={resolveMediaUrl(item.imageUrl)}
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
              <span className="absolute -end-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-background">
                {item.quantity}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  {item.brand}
                </p>
                <p className="mt-0.5 text-sm font-medium leading-snug break-words">
                  {item.name}
                </p>
              </div>
              <Price
                amountUsd={item.unitPriceUsd * item.quantity}
                size="inline"
                className="text-sm font-semibold"
              />
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-secondary">{t("cart.subtotal")}</dt>
          <dd className="font-medium">
            <Price amountUsd={subtotalUsd} size="inline" className="text-sm" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-secondary">{t("cart.shipping")}</dt>
          <dd className="font-medium">
            {shippingUsd === 0 ? (
              <span className="text-accent">{t("common.complimentary")}</span>
            ) : (
              <Price amountUsd={shippingUsd} size="inline" className="text-sm" />
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <dt className="text-base font-semibold">{t("checkout.total")}</dt>
          <dd className="text-base font-semibold text-accent">
            <span className="me-1.5 text-xs font-medium uppercase text-secondary">
              {currency}
            </span>
            <Price
              amountUsd={totalUsd}
              size="inline"
              className="text-base font-semibold"
            />
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-secondary">
        {t("common.pricesIn", { currency: currencyLabel })}{" "}
        {t("common.dutiesNote")}
      </p>

      {actions ? (
        <div className="mt-auto border-t border-border pt-5">{actions}</div>
      ) : null}
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
