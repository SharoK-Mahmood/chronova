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
import { isCardDetailsComplete } from "@/features/checkout/lib/card-format";
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
import { type as typography } from "@/shared/lib/typography";
import { cn } from "@/shared/lib/utils/cn";

function isInformationComplete(form: CheckoutFormData): boolean {
  const a = form.shippingAddress;
  return Boolean(
    form.contact.email.trim() &&
      form.contact.phone.trim() &&
      a.fullName.trim() &&
      a.phone.trim() &&
      a.countryCode &&
      a.governorate &&
      a.city.trim() &&
      a.district.trim() &&
      a.street.trim(),
  );
}

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
      <Container className="py-12">
        <p className="text-secondary">{t("checkout.preparing")}</p>
      </Container>
    );
  }

  if (itemCount === 0) {
    return (
      <Container className="py-12 text-center">
        <h1 className={cn(typography.page)}>{t("cart.empty")}</h1>
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

    if (!isInformationComplete(form)) {
      setError(t("checkout.informationError"));
      document.getElementById("checkout-information")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (
      form.paymentMethodId === "card" &&
      !isCardDetailsComplete(form.cardDetails)
    ) {
      setError(t("checkout.cardError"));
      return;
    }

    if (form.paymentMethodId === "paypal" && !form.paypalEmail.trim()) {
      setError(t("checkout.paypalError"));
      return;
    }

    if (form.paymentMethodId === "bank-transfer" && !form.bankAcknowledged) {
      setError(t("checkout.bankError"));
      return;
    }

    setIsSubmitting(true);

    const orderNumber = generateOrderNumber();
    const paymentMethod = getLocalizedPaymentMethod(form.paymentMethodId, t);
    const localizedDelivery = getLocalizedDeliveryMethod(
      form.deliveryMethodId,
      t,
    );
    const estimatedDelivery = estimateDelivery(deliveryMethod);

    const paymentLabel =
      form.paymentMethodId === "paypal" && form.paypalEmail.trim()
        ? `${paymentMethod.label} (${form.paypalEmail.trim()})`
        : paymentMethod.label;

    saveOrder({
      orderNumber,
      placedAt: new Date().toISOString(),
      contact: form.contact,
      shippingAddress: form.shippingAddress,
      deliveryMethodId: form.deliveryMethodId,
      deliveryLabel: localizedDelivery.label,
      paymentMethodId: form.paymentMethodId,
      paymentLabel,
      lineItems,
      subtotalUsd,
      shippingUsd,
      totalUsd,
      currency,
      estimatedDelivery,
      status:
        form.paymentMethodId === "bank-transfer"
          ? ("processing" as const)
          : ("confirmed" as const),
    });

    clearCart();
    router.push(`/checkout/confirmation/${orderNumber}`);
  }

  const submitLabel = isSubmitting
    ? t("checkout.placingOrder")
    : form.paymentMethodId === "paypal"
      ? t("checkout.continuePayPal")
      : form.paymentMethodId === "bank-transfer"
        ? t("checkout.confirmBankOrder")
        : t("checkout.placeOrder");

  const orderActions = (
    <div className="space-y-3">
      <Button
        type="submit"
        variant="accent"
        effect="luxury"
        className="w-full px-8 py-3.5 text-base"
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
      <p className="text-center text-xs leading-relaxed text-secondary">
        {t("checkout.termsNote")}
      </p>
    </div>
  );

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-accent">
                {t("checkout.secure")}
              </p>
              <h1 className={cn("mt-2 text-background", typography.page)}>
                {t("checkout.title")}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-background/70">
                {t("checkout.subtitle")}
              </p>
            </div>
            <nav
              aria-label={t("checkout.title")}
              className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-background/70"
            >
              <a
                href="#checkout-information"
                className="hover:text-accent"
              >
                {t("checkout.steps.information")}
              </a>
              <span className="text-background/40" aria-hidden>
                /
              </span>
              <a href="#checkout-shipping" className="hover:text-accent">
                {t("checkout.steps.shipping")}
              </a>
              <span className="text-background/40" aria-hidden>
                /
              </span>
              <a href="#checkout-payment" className="hover:text-accent">
                {t("checkout.steps.payment")}
              </a>
            </nav>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid min-w-0 gap-6 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start lg:gap-8">
            <div className="min-w-0 space-y-4">
              <div className="grid min-w-0 gap-4 md:grid-cols-2 md:items-start">
                <section
                  id="checkout-information"
                  className="scroll-mt-28 space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:self-stretch"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    1 · {t("checkout.steps.information")}
                  </p>
                  <ContactInformationSection
                    value={form.contact}
                    onChange={(contact) =>
                      setForm((current) => ({ ...current, contact }))
                    }
                  />
                  <div className="border-t border-border pt-5">
                    <ShippingAddressSection
                      value={form.shippingAddress}
                      onChange={(shippingAddress) =>
                        setForm((current) => ({
                          ...current,
                          shippingAddress,
                        }))
                      }
                    />
                  </div>
                </section>

                <div className="flex min-w-0 flex-col gap-4">
                  <section
                    id="checkout-shipping"
                    className="scroll-mt-28 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      2 · {t("checkout.steps.shipping")}
                    </p>
                    <DeliveryMethodSection
                      value={form.deliveryMethodId}
                      onChange={(deliveryMethodId) =>
                        setForm((current) => ({
                          ...current,
                          deliveryMethodId,
                        }))
                      }
                    />
                  </section>

                  <section
                    id="checkout-payment"
                    className="scroll-mt-28 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      3 · {t("checkout.steps.payment")}
                    </p>
                    <PaymentMethodSection
                      paymentMethodId={form.paymentMethodId}
                      cardDetails={form.cardDetails}
                      paypalEmail={form.paypalEmail}
                      bankAcknowledged={form.bankAcknowledged}
                      onPaymentMethodChange={(paymentMethodId) =>
                        setForm((current) => ({
                          ...current,
                          paymentMethodId,
                        }))
                      }
                      onCardDetailsChange={(cardDetails) =>
                        setForm((current) => ({ ...current, cardDetails }))
                      }
                      onPaypalEmailChange={(paypalEmail) =>
                        setForm((current) => ({ ...current, paypalEmail }))
                      }
                      onBankAcknowledgedChange={(bankAcknowledged) =>
                        setForm((current) => ({
                          ...current,
                          bankAcknowledged,
                        }))
                      }
                    />
                  </section>
                </div>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <div className="lg:hidden">
                <CheckoutOrderSummary
                  lineItems={lineItems}
                  deliveryMethodId={form.deliveryMethodId}
                  actions={orderActions}
                />
              </div>
            </div>

            <CheckoutOrderSummary
              lineItems={lineItems}
              deliveryMethodId={form.deliveryMethodId}
              className="hidden lg:flex"
              actions={orderActions}
            />
          </div>
        </form>
      </Container>
    </>
  );
}
