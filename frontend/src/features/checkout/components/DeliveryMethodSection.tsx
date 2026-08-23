import {
  DELIVERY_METHODS,
  type DeliveryMethod,
} from "@/features/checkout/constants/delivery-methods";
import { CheckoutSection } from "@/features/checkout/components/CheckoutSection";
import type { DeliveryMethodId } from "@/features/checkout/types/checkout.types";
import { Price } from "@/features/currency";
import { cn } from "@/shared/lib/utils/cn";

type DeliveryMethodSectionProps = {
  value: DeliveryMethodId;
  onChange: (value: DeliveryMethodId) => void;
};

function DeliveryOption({
  method,
  isSelected,
  onSelect,
}: {
  method: DeliveryMethod;
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium">{method.label}</p>
          <p className="text-sm font-medium text-accent">
            {method.shippingUsd === 0 ? (
              "Complimentary"
            ) : (
              <Price amountUsd={method.shippingUsd} />
            )}
          </p>
        </div>
        <p className="mt-1 text-sm text-secondary">{method.description}</p>
        <p className="mt-2 text-xs text-secondary">
          {method.minDays === method.maxDays
            ? `${method.minDays} business day`
            : `${method.minDays}–${method.maxDays} business days`}
        </p>
      </div>
    </button>
  );
}

export function DeliveryMethodSection({
  value,
  onChange,
}: DeliveryMethodSectionProps) {
  return (
    <CheckoutSection
      step={3}
      title="Delivery method"
      description="Choose how you'd like your timepiece delivered."
    >
      <div className="space-y-3">
        {DELIVERY_METHODS.map((method) => (
          <DeliveryOption
            key={method.id}
            method={method}
            isSelected={value === method.id}
            onSelect={() => onChange(method.id)}
          />
        ))}
      </div>
    </CheckoutSection>
  );
}
