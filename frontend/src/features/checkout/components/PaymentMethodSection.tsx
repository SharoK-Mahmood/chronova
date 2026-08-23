"use client";

import type { ReactNode } from "react";

import type { PaymentMethod } from "@/features/checkout/constants/payment-methods";
import { FormField } from "@/features/checkout/components/FormField";
import {
  BankTransferIcon,
  CardBrandIcons,
  PayPalIcon,
} from "@/features/checkout/components/PaymentBrandIcons";
import {
  formatCardExpiry,
  formatCardNumber,
  formatCvv,
} from "@/features/checkout/lib/card-format";
import { getLocalizedPaymentMethods } from "@/features/checkout/lib/localized-checkout";
import type { CardDetails, PaymentMethodId } from "@/features/checkout/types/checkout.types";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type PaymentMethodSectionProps = {
  paymentMethodId: PaymentMethodId;
  cardDetails: CardDetails;
  paypalEmail: string;
  bankAcknowledged: boolean;
  onPaymentMethodChange: (value: PaymentMethodId) => void;
  onCardDetailsChange: (value: CardDetails) => void;
  onPaypalEmailChange: (value: string) => void;
  onBankAcknowledgedChange: (value: boolean) => void;
};

const BANK_DETAILS = [
  { key: "bankName" as const, value: "Chronova Holdings LLC" },
  { key: "accountName" as const, value: "Chronova Order Settlements" },
  { key: "iban" as const, value: "IQ98 CBIR 0000 0000 1234 5678" },
  { key: "swift" as const, value: "CBIRQBAX" },
];

function methodIcons(id: PaymentMethodId) {
  if (id === "card") return <CardBrandIcons />;
  if (id === "paypal") return <PayPalIcon />;
  return <BankTransferIcon />;
}

function PaymentRow({
  method,
  isSelected,
  onSelect,
  icons,
  children,
}: {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  icons: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={cn(isSelected ? "bg-background/70" : "bg-card")}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-start"
      >
        <span
          className={cn(
            "h-4 w-4 shrink-0 rounded-full border-2",
            isSelected ? "border-accent bg-accent" : "border-border",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-sm font-medium">{method.label}</span>
        <span className="shrink-0">{icons}</span>
      </button>
      {isSelected && children ? (
        <div className="border-t border-border px-3.5 pb-3.5 pt-3">{children}</div>
      ) : null}
    </div>
  );
}

export function PaymentMethodSection({
  paymentMethodId,
  cardDetails,
  paypalEmail,
  bankAcknowledged,
  onPaymentMethodChange,
  onCardDetailsChange,
  onPaypalEmailChange,
  onBankAcknowledgedChange,
}: PaymentMethodSectionProps) {
  const { t } = useTranslation();
  const paymentMethods = getLocalizedPaymentMethods(t);

  function updateCardField<K extends keyof CardDetails>(
    field: K,
    value: CardDetails[K],
  ) {
    onCardDetailsChange({ ...cardDetails, [field]: value });
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.payment")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.paymentDesc")}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border divide-y divide-border shadow-sm">
        {paymentMethods.map((method) => (
          <PaymentRow
            key={method.id}
            method={method}
            isSelected={paymentMethodId === method.id}
            onSelect={() => onPaymentMethodChange(method.id)}
            icons={methodIcons(method.id)}
          >
            {method.id === "card" ? (
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                    {t("checkout.card.accepted")}
                  </p>
                  <CardBrandIcons />
                </div>
                <FormField
                  label={t("checkout.card.name")}
                  htmlFor="checkout-card-name"
                  required
                >
                  <Input
                    id="checkout-card-name"
                    name="nameOnCard"
                    autoComplete="cc-name"
                    placeholder={t("address.placeholders.fullName")}
                    required
                    value={cardDetails.nameOnCard}
                    onChange={(event) =>
                      updateCardField("nameOnCard", event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label={t("checkout.card.number")}
                  htmlFor="checkout-card-number"
                  required
                >
                  <Input
                    id="checkout-card-number"
                    name="cardNumber"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder={t("checkout.card.numberPlaceholder")}
                    required
                    value={cardDetails.cardNumber}
                    onChange={(event) =>
                      updateCardField(
                        "cardNumber",
                        formatCardNumber(event.target.value),
                      )
                    }
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label={t("checkout.card.expiry")}
                    htmlFor="checkout-card-expiry"
                    required
                  >
                    <Input
                      id="checkout-card-expiry"
                      name="expiry"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      placeholder={t("checkout.card.expiryPlaceholder")}
                      required
                      value={cardDetails.expiry}
                      onChange={(event) =>
                        updateCardField(
                          "expiry",
                          formatCardExpiry(event.target.value),
                        )
                      }
                    />
                  </FormField>
                  <FormField
                    label={t("checkout.card.cvv")}
                    htmlFor="checkout-card-cvv"
                    required
                  >
                    <Input
                      id="checkout-card-cvv"
                      name="cvv"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      placeholder={t("checkout.card.cvvPlaceholder")}
                      required
                      value={cardDetails.cvv}
                      onChange={(event) =>
                        updateCardField("cvv", formatCvv(event.target.value))
                      }
                    />
                  </FormField>
                </div>
              </div>
            ) : null}

            {method.id === "paypal" ? (
              <div className="grid gap-3">
                <p className="text-sm text-secondary">{t("checkout.paypalNote")}</p>
                <FormField
                  label={t("checkout.paypal.email")}
                  htmlFor="checkout-paypal-email"
                  required
                >
                  <Input
                    id="checkout-paypal-email"
                    name="paypalEmail"
                    type="email"
                    autoComplete="email"
                    placeholder={t("checkout.paypal.emailPlaceholder")}
                    required
                    value={paypalEmail}
                    onChange={(event) => onPaypalEmailChange(event.target.value)}
                  />
                </FormField>
              </div>
            ) : null}

            {method.id === "bank-transfer" ? (
              <div className="grid gap-3">
                <p className="text-sm text-secondary">{t("checkout.bankNote")}</p>
                <dl className="grid gap-2 rounded-lg border border-border/80 bg-card px-3 py-2.5 text-sm">
                  {BANK_DETAILS.map((row) => (
                    <div
                      key={row.key}
                      className="flex flex-wrap items-baseline justify-between gap-x-3"
                    >
                      <dt className="text-secondary">
                        {t(`checkout.bank.${row.key}`)}
                      </dt>
                      <dd className="font-medium tracking-wide">{row.value}</dd>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-border pt-2">
                    <dt className="text-secondary">
                      {t("checkout.bank.reference")}
                    </dt>
                    <dd className="font-medium">
                      {t("checkout.bank.referenceHint")}
                    </dd>
                  </div>
                </dl>
                <label className="flex items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={bankAcknowledged}
                    onChange={(event) =>
                      onBankAcknowledgedChange(event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--color-accent,#c9a227)]"
                    required
                  />
                  <span>{t("checkout.bank.acknowledge")}</span>
                </label>
              </div>
            ) : null}
          </PaymentRow>
        ))}
      </div>
    </section>
  );
}
