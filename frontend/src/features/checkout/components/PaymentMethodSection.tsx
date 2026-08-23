"use client";

import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/features/checkout/constants/payment-methods";
import { CheckoutSection } from "@/features/checkout/components/CheckoutSection";
import { FormField } from "@/features/checkout/components/FormField";
import type { CardDetails, PaymentMethodId } from "@/features/checkout/types/checkout.types";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/utils/cn";

type PaymentMethodSectionProps = {
  paymentMethodId: PaymentMethodId;
  cardDetails: CardDetails;
  onPaymentMethodChange: (value: PaymentMethodId) => void;
  onCardDetailsChange: (value: CardDetails) => void;
};

function PaymentOption({
  method,
  isSelected,
  onSelect,
}: {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]",
        isSelected
          ? "border-accent bg-accent/5 shadow-sm ring-1 ring-accent/20"
          : "border-border hover:border-accent/30 hover:bg-background",
      )}
    >
      <div
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2",
          isSelected ? "border-accent bg-accent" : "border-border",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{method.label}</p>
        <p className="mt-1 text-sm text-secondary">{method.description}</p>
      </div>
    </button>
  );
}

export function PaymentMethodSection({
  paymentMethodId,
  cardDetails,
  onPaymentMethodChange,
  onCardDetailsChange,
}: PaymentMethodSectionProps) {
  function updateCardField<K extends keyof CardDetails>(
    field: K,
    value: CardDetails[K],
  ) {
    onCardDetailsChange({ ...cardDetails, [field]: value });
  }

  return (
    <CheckoutSection
      step={4}
      title="Payment method"
      description="All transactions are secured with bank-level encryption."
    >
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <PaymentOption
            key={method.id}
            method={method}
            isSelected={paymentMethodId === method.id}
            onSelect={() => onPaymentMethodChange(method.id)}
          />
        ))}
      </div>

      {paymentMethodId === "card" ? (
        <div className="mt-6 grid gap-5 rounded-xl border border-border bg-background/60 p-5">
          <FormField label="Name on card" htmlFor="checkout-card-name" required>
            <Input
              id="checkout-card-name"
              name="nameOnCard"
              autoComplete="cc-name"
              placeholder="Jane Doe"
              required
              value={cardDetails.nameOnCard}
              onChange={(event) =>
                updateCardField("nameOnCard", event.target.value)
              }
            />
          </FormField>
          <FormField label="Card number" htmlFor="checkout-card-number" required>
            <Input
              id="checkout-card-number"
              name="cardNumber"
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              required
              value={cardDetails.cardNumber}
              onChange={(event) =>
                updateCardField("cardNumber", event.target.value)
              }
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Expiry date" htmlFor="checkout-card-expiry" required>
              <Input
                id="checkout-card-expiry"
                name="expiry"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                required
                value={cardDetails.expiry}
                onChange={(event) =>
                  updateCardField("expiry", event.target.value)
                }
              />
            </FormField>
            <FormField label="Security code" htmlFor="checkout-card-cvv" required>
              <Input
                id="checkout-card-cvv"
                name="cvv"
                autoComplete="cc-csc"
                inputMode="numeric"
                placeholder="CVV"
                required
                value={cardDetails.cvv}
                onChange={(event) => updateCardField("cvv", event.target.value)}
              />
            </FormField>
          </div>
        </div>
      ) : null}

      {paymentMethodId === "paypal" ? (
        <p className="mt-4 rounded-xl border border-border bg-background/60 p-4 text-sm text-secondary">
          You will be redirected to PayPal after placing your order to complete
          payment securely.
        </p>
      ) : null}

      {paymentMethodId === "bank-transfer" ? (
        <p className="mt-4 rounded-xl border border-border bg-background/60 p-4 text-sm text-secondary">
          Wire transfer instructions will be included in your order confirmation
          email. Your order is reserved for 48 hours pending payment.
        </p>
      ) : null}
    </CheckoutSection>
  );
}
