"use client";

import type { DeliveryMethod } from "@/features/checkout/constants/delivery-methods";
import type { DeliveryMethodId } from "@/features/checkout/types/checkout.types";
import {
  formatBusinessDays,
  getLocalizedDeliveryMethods,
} from "@/features/checkout/lib/localized-checkout";
import { Price } from "@/features/currency";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type DeliveryMethodSectionProps = {
  value: DeliveryMethodId;
  onChange: (value: DeliveryMethodId) => void;
};

function DeliveryOption({
  method,
  isSelected,
  onSelect,
  businessDaysLabel,
  complimentaryLabel,
}: {
  method: DeliveryMethod;
  isSelected: boolean;
  onSelect: () => void;
  businessDaysLabel: string;
  complimentaryLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 px-3.5 py-3 text-start transition-colors",
        isSelected ? "bg-background/70" : "bg-card hover:bg-background/40",
      )}
    >
      <span
        className={cn(
          "h-4 w-4 shrink-0 rounded-full border-2",
          isSelected ? "border-accent bg-accent" : "border-border",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <p className="text-sm font-medium">{method.label}</p>
          <p className="text-sm font-medium text-accent">
            {method.shippingUsd === 0 ? (
              complimentaryLabel
            ) : (
              <Price amountUsd={method.shippingUsd} size="inline" />
            )}
          </p>
        </div>
        <p className="mt-0.5 text-xs text-secondary">
          {method.description} · {businessDaysLabel}
        </p>
      </div>
    </button>
  );
}

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
      <div className="overflow-hidden rounded-xl border border-border divide-y divide-border shadow-sm">
        {deliveryMethods.map((method) => (
          <DeliveryOption
            key={method.id}
            method={method}
            isSelected={value === method.id}
            onSelect={() => onChange(method.id)}
            complimentaryLabel={t("common.complimentary")}
            businessDaysLabel={formatBusinessDays(
              t,
              method.minDays,
              method.maxDays,
            )}
          />
        ))}
      </div>
    </section>
  );
}
