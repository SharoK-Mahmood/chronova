"use client";

import {
  BankTransferIcon,
  CardBrandIcons,
  PayPalIcon,
} from "@/features/checkout/components/PaymentBrandIcons";
import { FormField } from "@/shared/components/forms/FormField";
import {
  formatCardExpiry,
  formatCardNumber,
  formatCvv,
} from "@/features/checkout/lib/card-format";
import type {
  CardDetails,
  CheckoutFormData,
  PaymentMethodId,
} from "@/features/checkout/types/checkout.types";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import type { ReactNode } from "react";

const BANK_DETAILS = [
  { key: "bankName" as const, value: "Chronova Holdings LLC" },
  { key: "accountName" as const, value: "Chronova Order Settlements" },
  { key: "iban" as const, value: "IQ98 CBIR 0000 0000 1234 5678" },
  { key: "swift" as const, value: "CBIRQBAX" },
];

export type PaymentDetailsProps = {
  form: CheckoutFormData;
  onChange: (patch: Partial<CheckoutFormData>) => void;
};

function CardPaymentDetails({ form, onChange }: PaymentDetailsProps) {
  const { t } = useTranslation();
  const { cardDetails } = form;

  function updateCardField<K extends keyof CardDetails>(
    field: K,
    value: CardDetails[K],
  ) {
    onChange({ cardDetails: { ...cardDetails, [field]: value } });
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
          {t("checkout.card.accepted")}
        </p>
        <CardBrandIcons />
      </div>
      <FormField label={t("checkout.card.name")} htmlFor="checkout-card-name" required>
        <Input
          id="checkout-card-name"
          name="nameOnCard"
          autoComplete="cc-name"
          placeholder={t("address.placeholders.fullName")}
          required
          value={cardDetails.nameOnCard}
          onChange={(event) => updateCardField("nameOnCard", event.target.value)}
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
            updateCardField("cardNumber", formatCardNumber(event.target.value))
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
              updateCardField("expiry", formatCardExpiry(event.target.value))
            }
          />
        </FormField>
        <FormField label={t("checkout.card.cvv")} htmlFor="checkout-card-cvv" required>
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
  );
}

function PayPalPaymentDetails({ form, onChange }: PaymentDetailsProps) {
  const { t } = useTranslation();

  return (
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
          value={form.paypalEmail}
          onChange={(event) => onChange({ paypalEmail: event.target.value })}
        />
      </FormField>
    </div>
  );
}

function BankPaymentDetails({ form, onChange }: PaymentDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3">
      <p className="text-sm text-secondary">{t("checkout.bankNote")}</p>
      <dl className="grid gap-2 rounded-lg border border-border/80 bg-card px-3 py-2.5 text-sm">
        {BANK_DETAILS.map((row) => (
          <div
            key={row.key}
            className="flex flex-wrap items-baseline justify-between gap-x-3"
          >
            <dt className="text-secondary">{t(`checkout.bank.${row.key}`)}</dt>
            <dd className="font-medium tracking-wide">{row.value}</dd>
          </div>
        ))}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-border pt-2">
          <dt className="text-secondary">{t("checkout.bank.reference")}</dt>
          <dd className="font-medium">{t("checkout.bank.referenceHint")}</dd>
        </div>
      </dl>
      <label className="flex items-start gap-2.5 text-sm">
        <input
          id="checkout-bank-acknowledged"
          name="bankAcknowledged"
          type="checkbox"
          checked={form.bankAcknowledged}
          onChange={(event) =>
            onChange({ bankAcknowledged: event.target.checked })
          }
          className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--color-accent,#192841)]"
          required
        />
        <span>{t("checkout.bank.acknowledge")}</span>
      </label>
    </div>
  );
}

type PaymentUiDefinition = {
  icons: ReactNode;
  Details: (props: PaymentDetailsProps) => ReactNode;
};

/** UI registry — add a payment method here + constants entry + i18n keys. */
export const PAYMENT_UI: Record<PaymentMethodId, PaymentUiDefinition> = {
  card: {
    icons: <CardBrandIcons />,
    Details: CardPaymentDetails,
  },
  paypal: {
    icons: <PayPalIcon />,
    Details: PayPalPaymentDetails,
  },
  "bank-transfer": {
    icons: <BankTransferIcon />,
    Details: BankPaymentDetails,
  },
};
