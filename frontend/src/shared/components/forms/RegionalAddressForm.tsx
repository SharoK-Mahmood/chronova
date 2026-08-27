"use client";

import type { RegionalAddress } from "@/shared/lib/address/regional-address";
import {
  ADDRESS_REGIONS,
  GOVERNORATE_KEYS,
  type AddressCountryCode,
} from "@/shared/lib/address/iraq-address";
import { FormField } from "@/shared/components/forms/FormField";
import { Input } from "@/shared/components/ui/Input";
import { LuxurySelect } from "@/shared/components/ui/LuxurySelect";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type RegionalAddressFormProps = {
  value: RegionalAddress;
  onChange: (value: RegionalAddress) => void;
  prefix: string;
  variant?: "account" | "checkout";
};

export function RegionalAddressForm({
  value,
  onChange,
  prefix,
  variant = "account",
}: RegionalAddressFormProps) {
  const { t } = useTranslation();
  const governorates = GOVERNORATE_KEYS[value.countryCode] ?? [];
  const required = variant === "checkout";
  const gridGap = variant === "checkout" ? "gap-4" : "gap-4";
  const labelClassName =
    variant === "checkout"
      ? "mb-1 block text-xs font-medium"
      : "mb-2 block text-sm font-medium";

  function updateField<K extends keyof RegionalAddress>(
    field: K,
    fieldValue: RegionalAddress[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  function handleCountryChange(countryCode: AddressCountryCode) {
    const nextGovernorates = GOVERNORATE_KEYS[countryCode];
    const governorate = nextGovernorates.includes(value.governorate)
      ? value.governorate
      : "";

    onChange({ ...value, countryCode, governorate });
  }

  const countryOptions = ADDRESS_REGIONS.map((region) => ({
    value: region.code,
    label:
      region.code === "iraq"
        ? t("address.countryIraq")
        : t("address.countryKurdistanRegion"),
  }));

  const governorateOptions = governorates.map((key) => ({
    value: key,
    label: t(`address.governorates.${key}`),
  }));

  return (
    <div className={cn("grid min-w-0 sm:grid-cols-2", gridGap)}>
      <FormField
        label={t("address.fullName")}
        htmlFor={`${prefix}-fullName`}
        required={required}
        className="sm:col-span-2"
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-fullName`}
          name="fullName"
          autoComplete="name"
          required={required}
          placeholder={t("address.placeholders.fullName")}
          value={value.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("address.phone")}
        htmlFor={`${prefix}-phone`}
        required={required}
        className="sm:col-span-2"
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          required={required}
          placeholder={t("address.placeholders.phone")}
          value={value.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("address.country")}
        htmlFor={`${prefix}-country`}
        required={required}
        labelClassName={labelClassName}
      >
        <LuxurySelect
          id={`${prefix}-country`}
          name="countryCode"
          value={value.countryCode}
          onChange={(countryCode) =>
            handleCountryChange(countryCode as AddressCountryCode)
          }
          options={countryOptions}
          required={required}
          ariaLabel={t("address.country")}
        />
      </FormField>

      <FormField
        label={t("address.governorate")}
        htmlFor={`${prefix}-governorate`}
        required={required}
        labelClassName={labelClassName}
      >
        <LuxurySelect
          id={`${prefix}-governorate`}
          name="governorate"
          value={value.governorate}
          onChange={(governorate) => updateField("governorate", governorate)}
          options={governorateOptions}
          placeholder={t("address.selectGovernorate")}
          required={required}
          ariaLabel={t("address.governorate")}
        />
      </FormField>

      <FormField
        label={t("address.city")}
        htmlFor={`${prefix}-city`}
        required={required}
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-city`}
          name="city"
          autoComplete="address-level2"
          required={required}
          placeholder={t("address.placeholders.city")}
          value={value.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("address.district")}
        htmlFor={`${prefix}-district`}
        required={required}
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-district`}
          name="district"
          required={required}
          placeholder={t("address.placeholders.district")}
          value={value.district}
          onChange={(event) => updateField("district", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("address.street")}
        htmlFor={`${prefix}-street`}
        required={required}
        className="sm:col-span-2"
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-street`}
          name="street"
          autoComplete="address-line1"
          required={required}
          placeholder={t("address.placeholders.street")}
          value={value.street}
          onChange={(event) => updateField("street", event.target.value)}
        />
      </FormField>

      <FormField
        label={`${t("address.details")} (${t("common.optional")})`}
        htmlFor={`${prefix}-details`}
        className="sm:col-span-2"
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-details`}
          name="details"
          autoComplete="address-line2"
          placeholder={t("address.placeholders.details")}
          value={value.details}
          onChange={(event) => updateField("details", event.target.value)}
        />
      </FormField>

      <FormField
        label={t("address.postalCode")}
        htmlFor={`${prefix}-postal`}
        className="sm:col-span-2 sm:max-w-xs"
        labelClassName={labelClassName}
      >
        <Input
          id={`${prefix}-postal`}
          name="postalCode"
          autoComplete="postal-code"
          placeholder={t("address.placeholders.postalCode")}
          value={value.postalCode}
          onChange={(event) => updateField("postalCode", event.target.value)}
        />
      </FormField>
    </div>
  );
}
