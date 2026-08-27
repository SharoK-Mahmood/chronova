"use client";

import {
  SelectableOptionList,
  SelectableOptionRow,
} from "@/features/checkout/components/SelectableOptionList";
import type { DeliveryMethodId } from "@/features/checkout/types/checkout.types";
import {
  formatBusinessDays,
  getLocalizedDeliveryMethods,
} from "@/features/checkout/lib/localized-checkout";
import { Price } from "@/features/currency";
import { useTranslation } from "@/shared/i18n";

type DeliveryMethodSectionProps = {
  value: DeliveryMethodId;
  onChange: (value: DeliveryMethodId) => void;
};

export function DeliveryMethodSection({
  value,
  onChange,
}: DeliveryMethodSectionProps) {
  const { t } = useTranslation();
  const deliveryMethods = getLocalizedDeliveryMethods(t);

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.delivery")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.deliveryDesc")}</p>
      </div>

      <SelectableOptionList>
        {deliveryMethods.map((method) => (
          <SelectableOptionRow
            key={method.id}
            selected={value === method.id}
            onSelect={() => onChange(method.id)}
            label={method.label}
            description={
              <>
                {method.description} ·{" "}
                {formatBusinessDays(t, method.minDays, method.maxDays)}
              </>
            }
            trailing={
              <span className="text-sm font-medium text-accent">
                {method.shippingUsd === 0 ? (
                  t("common.complimentary")
                ) : (
                  <Price amountUsd={method.shippingUsd} size="inline" />
                )}
              </span>
            }
          />
        ))}
      </SelectableOptionList>
    </section>
  );
}
