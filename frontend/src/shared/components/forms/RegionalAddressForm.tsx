"use client";

import type { RegionalAddress } from "@/shared/lib/address/regional-address";
import {
  ADDRESS_REGIONS,
  GOVERNORATE_KEYS,
  type AddressCountryCode,
} from "@/shared/lib/address/iraq-address";
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

  const gridGap = variant === "checkout" ? "gap-5" : "gap-4";

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
      <div className="sm:col-span-2">
        <label
          htmlFor={`${prefix}-fullName`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.fullName")}
        </label>
        <Input
          id={`${prefix}-fullName`}
          name="fullName"
          autoComplete="name"
          required={variant === "checkout"}
          placeholder={t("address.placeholders.fullName")}
          value={value.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor={`${prefix}-phone`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.phone")}
        </label>
        <Input
          id={`${prefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          required={variant === "checkout"}
          placeholder={t("address.placeholders.phone")}
          value={value.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}-country`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.country")}
        </label>
        <LuxurySelect
          id={`${prefix}-country`}
          name="countryCode"
          value={value.countryCode}
          onChange={(countryCode) =>
            handleCountryChange(countryCode as AddressCountryCode)
          }
          options={countryOptions}
          required={variant === "checkout"}
          ariaLabel={t("address.country")}
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}-governorate`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.governorate")}
        </label>
        <LuxurySelect
          id={`${prefix}-governorate`}
          name="governorate"
          value={value.governorate}
          onChange={(governorate) => updateField("governorate", governorate)}
          options={governorateOptions}
          placeholder={t("address.selectGovernorate")}
          required={variant === "checkout"}
          ariaLabel={t("address.governorate")}
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}-city`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.city")}
        </label>
        <Input
          id={`${prefix}-city`}
          name="city"
          autoComplete="address-level2"
          required={variant === "checkout"}
          placeholder={t("address.placeholders.city")}
          value={value.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}-district`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.district")}
        </label>
        <Input
          id={`${prefix}-district`}
          name="district"
          placeholder={t("address.placeholders.district")}
          value={value.district}
          onChange={(event) => updateField("district", event.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor={`${prefix}-street`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.street")}
        </label>
        <Input
          id={`${prefix}-street`}
          name="street"
          autoComplete="address-line1"
          required={variant === "checkout"}
          placeholder={t("address.placeholders.street")}
          value={value.street}
          onChange={(event) => updateField("street", event.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor={`${prefix}-details`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.details")}{" "}
          <span className="font-normal text-secondary">({t("common.optional")})</span>
        </label>
        <Input
          id={`${prefix}-details`}
          name="details"
          autoComplete="address-line2"
          placeholder={t("address.placeholders.details")}
          value={value.details}
          onChange={(event) => updateField("details", event.target.value)}
        />
      </div>

      <div className="sm:col-span-2 sm:max-w-xs">
        <label
          htmlFor={`${prefix}-postal`}
          className="mb-2 block text-sm font-medium"
        >
          {t("address.postalCode")}
        </label>
        <Input
          id={`${prefix}-postal`}
          name="postalCode"
          autoComplete="postal-code"
          placeholder={t("address.placeholders.postalCode")}
          value={value.postalCode}
          onChange={(event) => updateField("postalCode", event.target.value)}
        />
      </div>
    </div>
  );
}
