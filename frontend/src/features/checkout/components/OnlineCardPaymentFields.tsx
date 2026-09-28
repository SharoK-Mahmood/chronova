"use client";

import type { CardPaymentDetails } from "@/features/checkout/types/checkout.types";
import { FormField } from "@/shared/components/forms/FormField";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";

type OnlineCardPaymentFieldsProps = {
  value: CardPaymentDetails;
  onChange: (value: CardPaymentDetails) => void;
};

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function OnlineCardPaymentFields({
  value,
  onChange,
}: OnlineCardPaymentFieldsProps) {
  const { t } = useTranslation();

  function updateField<K extends keyof CardPaymentDetails>(
    field: K,
    fieldValue: CardPaymentDetails[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FormField
        label={t("checkout.card.cardholderName")}
        htmlFor="checkout-cardholder"
        required
        className="sm:col-span-2"
        labelClassName="mb-1 block text-xs font-medium"
      >
        <Input
          id="checkout-cardholder"
          name="cardholderName"
          autoComplete="cc-name"
          required
          placeholder={t("checkout.card.cardholderPlaceholder")}
          value={value.cardholderName}
          onChange={(event) => updateField("cardholderName", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("checkout.card.cardNumber")}
        htmlFor="checkout-card-number"
        required
        className="sm:col-span-2"
        labelClassName="mb-1 block text-xs font-medium"
      >
        <Input
          id="checkout-card-number"
          name="cardNumber"
          inputMode="numeric"
          autoComplete="cc-number"
          required
          placeholder="ACCT-000003"
          value={value.cardNumber}
          onChange={(event) =>
            updateField("cardNumber", formatCardNumber(event.target.value))
          }
        />
      </FormField>

      <FormField
        label={t("checkout.card.expiry")}
        htmlFor="checkout-card-expiry"
        required
        labelClassName="mb-1 block text-xs font-medium"
      >
        <Input
          id="checkout-card-expiry"
          name="expiry"
          inputMode="numeric"
          autoComplete="cc-exp"
          required
          placeholder="MM/YY"
          value={value.expiry}
          onChange={(event) =>
            updateField("expiry", formatExpiry(event.target.value))
          }
        />
      </FormField>

      <FormField
        label={t("checkout.card.cvc")}
        htmlFor="checkout-card-cvc"
        required
        labelClassName="mb-1 block text-xs font-medium"
      >
        <Input
          id="checkout-card-cvc"
          name="cvc"
          inputMode="numeric"
          autoComplete="cc-csc"
          required
          placeholder="123"
          value={value.cvc}
          onChange={(event) =>
            updateField(
              "cvc",
              event.target.value.replace(/\D/g, "").slice(0, 4),
            )
          }
        />
      </FormField>

      <p className="sm:col-span-2 text-xs leading-relaxed text-secondary">
        {t("checkout.card.secureNote")}
      </p>
    </div>
  );
}
