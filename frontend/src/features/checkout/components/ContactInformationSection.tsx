"use client";

import type { ContactInformation } from "@/features/checkout/types/checkout.types";
import { FormField } from "@/shared/components/forms/FormField";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";

type ContactInformationSectionProps = {
  value: ContactInformation;
  onChange: (value: ContactInformation) => void;
};

export function ContactInformationSection({
  value,
  onChange,
}: ContactInformationSectionProps) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.contact")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.contactDesc")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t("checkout.email")} htmlFor="checkout-email" required>
          <Input
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={value.email}
            onChange={(event) =>
              onChange({ ...value, email: event.target.value })
            }
          />
        </FormField>
        <FormField label={t("checkout.phone")} htmlFor="checkout-phone" required>
          <Input
            id="checkout-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("address.placeholders.phone")}
            required
            value={value.phone}
            onChange={(event) =>
              onChange({ ...value, phone: event.target.value })
            }
          />
        </FormField>
      </div>
    </section>
  );
}
