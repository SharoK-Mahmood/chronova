"use client";

import type { ShippingAddress } from "@/features/checkout/types/checkout.types";
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
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.shipping")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.shippingDesc")}</p>
      </div>
      <RegionalAddressForm
        value={value}
        onChange={onChange}
        prefix="checkout"
        variant="checkout"
      />
    </section>
  );
}
