"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { useCart } from "@/features/cart";
import { ContactInformationSection } from "@/features/checkout/components/ContactInformationSection";
import {
  CheckoutOrderSummary,
  useCheckoutTotals,
} from "@/features/checkout/components/CheckoutOrderSummary";
import { DeliveryMethodSection } from "@/features/checkout/components/DeliveryMethodSection";
import { PaymentMethodSection } from "@/features/checkout/components/PaymentMethodSection";
import { ShippingAddressSection } from "@/features/checkout/components/ShippingAddressSection";
import { DEFAULT_CHECKOUT_FORM } from "@/features/checkout/constants/default-checkout-form";
import {
  getLocalizedDeliveryMethod,
  getLocalizedPaymentMethod,
} from "@/features/checkout/lib/localized-checkout";
import { buildOrderLineItems } from "@/features/checkout/lib/build-order-line-items";
import { estimateDelivery } from "@/features/checkout/lib/estimate-delivery";
import { generateOrderNumber } from "@/features/checkout/lib/generate-order-number";
import { saveOrder } from "@/features/checkout/lib/order-storage";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { useCurrency } from "@/features/currency";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function CheckoutContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { entries, isHydrated, itemCount, clearCart } = useCart();
  const { currency } = useCurrency();
  const [form, setForm] = useState<CheckoutFormData>(DEFAULT_CHECKOUT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineItems = useMemo(() => buildOrderLineItems(entries), [entries]);
  const { subtotalUsd, shippingUsd, totalUsd, deliveryMethod } = useCheckoutTotals(
    lineItems,
    form.deliveryMethodId,
  );

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">{t("checkout.preparing")}</p>
      </Container>
    );
  }

  if (itemCount === 0) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("cart.empty")}
        </h1>
        <p className="mt-3 text-secondary">{t("cart.emptyDesc")}</p>
        <Button href="/products" variant="accent" className="mt-8">
          {t("common.browseWatches")}
        </Button>
      </Container>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.paymentMethodId === "card") {
      const { nameOnCard, cardNumber, expiry, cvv } = form.cardDetails;
      if (!nameOnCard || !cardNumber || !expiry || !cvv) {
        setError(t("checkout.cardError"));
        return;
      }
    }

    setIsSubmitting(true);

    const orderNumber = generateOrderNumber();
    const paymentMethod = getLocalizedPaymentMethod(form.paymentMethodId, t);
    const localizedDelivery = getLocalizedDeliveryMethod(form.deliveryMethodId, t);
    const estimatedDelivery = estimateDelivery(deliveryMethod);

    const order = {
      orderNumber,
      placedAt: new Date().toISOString(),
      contact: form.contact,
      shippingAddress: form.shippingAddress,
      deliveryMethodId: form.deliveryMethodId,
      deliveryLabel: localizedDelivery.label,
      paymentMethodId: form.paymentMethodId,
      paymentLabel: paymentMethod.label,
      lineItems,
      subtotalUsd,
      shippingUsd,
      totalUsd,
      currency,
      estimatedDelivery,
      status: "confirmed" as const,
    };

    saveOrder(order);

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/e48f63ee-04ff-42df-9270-03f44f8af41e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "c7537f",
      },
      body: JSON.stringify({
        sessionId: "c7537f",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "CheckoutContent.tsx:handleSubmit",
        message: "before clearCart and router.push",
        data: {
          orderNumber,
          itemCount,
          isSubmitting: true,
          pathname:
            typeof window !== "undefined" ? window.location.pathname : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    clearCart();

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/e48f63ee-04ff-42df-9270-03f44f8af41e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "c7537f",
      },
      body: JSON.stringify({
        sessionId: "c7537f",
        runId: "pre-fix",
        hypothesisId: "D",
        location: "CheckoutContent.tsx:handleSubmit",
        message: "calling router.push after clearCart",
        data: {
          target: `/checkout/confirmation/${orderNumber}`,
          pathname:
            typeof window !== "undefined" ? window.location.pathname : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    router.push(`/checkout/confirmation/${orderNumber}`);
  }

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            {t("checkout.secure")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("checkout.title")}
          </h1>
          <p className="mt-3 max-w-xl text-background/70">
            {t("checkout.subtitle")}
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-6">
              <ContactInformationSection
                value={form.contact}
                onChange={(contact) => setForm((current) => ({ ...current, contact }))}
              />
              <ShippingAddressSection
                value={form.shippingAddress}
                onChange={(shippingAddress) =>
                  setForm((current) => ({ ...current, shippingAddress }))
                }
              />
              <DeliveryMethodSection
                value={form.deliveryMethodId}
                onChange={(deliveryMethodId) =>
                  setForm((current) => ({ ...current, deliveryMethodId }))
                }
              />
              <PaymentMethodSection
                paymentMethodId={form.paymentMethodId}
                cardDetails={form.cardDetails}
                onPaymentMethodChange={(paymentMethodId) =>
                  setForm((current) => ({ ...current, paymentMethodId }))
                }
                onCardDetailsChange={(cardDetails) =>
                  setForm((current) => ({ ...current, cardDetails }))
                }
              />

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="lg:hidden">
                <CheckoutOrderSummary
                  lineItems={lineItems}
                  deliveryMethodId={form.deliveryMethodId}
                  className="mb-6"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                effect="luxury"
                className="w-full px-8 py-4 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
              </Button>

              <p className="text-center text-xs text-secondary">
                {t("checkout.termsNote")}
              </p>
            </div>

            <CheckoutOrderSummary
              lineItems={lineItems}
              deliveryMethodId={form.deliveryMethodId}
              className="hidden lg:block"
            />
          </div>
        </form>
      </Container>
    </>
  );
}
