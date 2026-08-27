"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { useCart } from "@/features/cart";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { ContactInformationSection } from "@/features/checkout/components/ContactInformationSection";
import {
  CheckoutOrderSummary,
} from "@/features/checkout/components/CheckoutOrderSummary";
import { CheckoutPanel } from "@/features/checkout/components/CheckoutPanel";
import { DeliveryMethodSection } from "@/features/checkout/components/DeliveryMethodSection";
import { PaymentMethodSection } from "@/features/checkout/components/PaymentMethodSection";
import { ShippingAddressSection } from "@/features/checkout/components/ShippingAddressSection";
import { DEFAULT_CHECKOUT_FORM } from "@/features/checkout/constants/default-checkout-form";
import { getPaymentSubmitLabelKey } from "@/features/checkout/lib/build-placed-order";
import { createOrder } from "@/features/checkout/services/orders.service";
import { buildOrderLineItems } from "@/features/checkout/lib/build-order-line-items";
import { validateCheckout } from "@/features/checkout/lib/validate-checkout";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { useCurrency } from "@/features/currency";
import { useProductCatalog } from "@/features/products";
import { ApiClientError } from "@/shared/lib/api/client";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";
import { cn } from "@/shared/lib/utils/cn";

export function CheckoutContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { entries, isHydrated, itemCount, clearCart } = useCart();
  const { currency } = useCurrency();
  const { getProductBySlug } = useProductCatalog();
  const { isAuthenticated, isHydrated: isAuthHydrated } = useAuth();
  const [form, setForm] = useState<CheckoutFormData>(DEFAULT_CHECKOUT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineItems = useMemo(
    () => buildOrderLineItems(entries, getProductBySlug),
    [entries, getProductBySlug],
  );

  function patchForm(patch: Partial<CheckoutFormData>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  if (!isHydrated || !isAuthHydrated) {
    return (
      <Container className="py-12">
        <p className="text-secondary">{t("checkout.preparing")}</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-12 text-center">
        <h1 className={cn(typography.page)}>{t("auth.signInToCheckout")}</h1>
        <p className="mt-3 text-secondary">{t("auth.signInToContinue")}</p>
        <Button href="/login?next=/checkout" variant="accent" className="mt-8">
          {t("auth.logIn")}
        </Button>
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = validateCheckout(form);
    if (!result.ok) {
      setError(t(result.errorKey));
      if (result.scrollTo) {
        document.getElementById(result.scrollTo)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        contact: form.contact,
        shippingAddress: form.shippingAddress,
        deliveryMethodId: form.deliveryMethodId,
        paymentMethodId: form.paymentMethodId,
        paypalEmail: form.paypalEmail.trim() || undefined,
        items: lineItems.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
        currency,
      });

      clearCart();
      router.push(`/checkout/confirmation/${order.orderNumber}`);
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("checkout.placeOrderError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitLabel = isSubmitting
    ? t("checkout.placingOrder")
    : t(getPaymentSubmitLabelKey(form.paymentMethodId));

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
              <a href="#checkout-information" className="hover:text-accent">
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
                <CheckoutPanel
                  id="checkout-information"
                  step={1}
                  title={t("checkout.steps.information")}
                  className="space-y-5 md:self-stretch"
                >
                  <ContactInformationSection
                    value={form.contact}
                    onChange={(contact) => patchForm({ contact })}
                  />
                  <div className="border-t border-border pt-5">
                    <ShippingAddressSection
                      value={form.shippingAddress}
                      onChange={(shippingAddress) =>
                        patchForm({ shippingAddress })
                      }
                    />
                  </div>
                </CheckoutPanel>

                <div className="flex min-w-0 flex-col gap-4">
                  <CheckoutPanel
                    id="checkout-shipping"
                    step={2}
                    title={t("checkout.steps.shipping")}
                  >
                    <DeliveryMethodSection
                      value={form.deliveryMethodId}
                      onChange={(deliveryMethodId) =>
                        patchForm({ deliveryMethodId })
                      }
                    />
                  </CheckoutPanel>

                  <CheckoutPanel
                    id="checkout-payment"
                    step={3}
                    title={t("checkout.steps.payment")}
                  >
                    <PaymentMethodSection form={form} onChange={patchForm} />
                  </CheckoutPanel>
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
