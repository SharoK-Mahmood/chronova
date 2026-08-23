"use client";

import type { ShippingAddress } from "@/features/checkout/types/checkout.types";
import { CheckoutSection } from "@/features/checkout/components/CheckoutSection";
import { RegionalAddressForm } from "@/shared/components/forms/RegionalAddressForm";
import { useTranslation } from "@/shared/i18n";

type ShippingAddressSectionProps = {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
};

export function ShippingAddressSection({
  value,
  onChange,
}: ShippingAddressSectionProps) {
  const { t } = useTranslation();

  return (
    <CheckoutSection
      step={2}
      title={t("checkout.shipping")}
      description={t("checkout.shippingDesc")}
    >
      <RegionalAddressForm
        value={value}
        onChange={onChange}
        prefix="checkout"
        variant="checkout"
      />
    </CheckoutSection>
  );
}
