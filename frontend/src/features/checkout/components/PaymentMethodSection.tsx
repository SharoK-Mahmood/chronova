"use client";

import {
  SelectableOptionList,
  SelectableOptionRow,
} from "@/features/checkout/components/SelectableOptionList";
import { OnlineCardPaymentFields } from "@/features/checkout/components/OnlineCardPaymentFields";
import { getLocalizedPaymentMethods } from "@/features/checkout/lib/localized-checkout";
import type {
  CardPaymentDetails,
  PaymentMethodId,
} from "@/features/checkout/types/checkout.types";
import { useTranslation } from "@/shared/i18n";

type PaymentMethodSectionProps = {
  value: PaymentMethodId;
  onChange: (value: PaymentMethodId) => void;
  cardPayment: CardPaymentDetails;
  onCardPaymentChange: (value: CardPaymentDetails) => void;
};

export function PaymentMethodSection({
  value,
  onChange,
  cardPayment,
  onCardPaymentChange,
}: PaymentMethodSectionProps) {
  const { t } = useTranslation();
  const paymentMethods = getLocalizedPaymentMethods(t);

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.payment")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.paymentDesc")}</p>
      </div>

      <SelectableOptionList>
        {paymentMethods.map((method) => (
          <SelectableOptionRow
            key={method.id}
            selected={value === method.id}
            onSelect={() => onChange(method.id)}
            label={method.label}
            description={method.description}
          >
            {method.id === "cod" ? (
              <p className="text-sm leading-relaxed text-secondary">
                {t("checkout.codNote")}
              </p>
            ) : (
              <OnlineCardPaymentFields
                value={cardPayment}
                onChange={onCardPaymentChange}
              />
            )}
          </SelectableOptionRow>
        ))}
      </SelectableOptionList>
    </section>
  );
}
