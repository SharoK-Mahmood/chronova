"use client";

import { PAYMENT_UI } from "@/features/checkout/components/payment-details";
import {
  SelectableOptionList,
  SelectableOptionRow,
} from "@/features/checkout/components/SelectableOptionList";
import { PAYMENT_METHODS } from "@/features/checkout/constants/payment-methods";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { useTranslation } from "@/shared/i18n";

type PaymentMethodSectionProps = {
  form: CheckoutFormData;
  onChange: (patch: Partial<CheckoutFormData>) => void;
};

export function PaymentMethodSection({
  form,
  onChange,
}: PaymentMethodSectionProps) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.payment")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.paymentDesc")}</p>
      </div>

      <SelectableOptionList>
        {PAYMENT_METHODS.map((method) => {
          const selected = form.paymentMethodId === method.id;
          const ui = PAYMENT_UI[method.id];
          const Details = ui.Details;

          return (
            <SelectableOptionRow
              key={method.id}
              selected={selected}
              onSelect={() => onChange({ paymentMethodId: method.id })}
              label={t(method.labelKey)}
              trailing={ui.icons}
            >
              <Details form={form} onChange={onChange} />
            </SelectableOptionRow>
          );
        })}
      </SelectableOptionList>
    </section>
  );
}
