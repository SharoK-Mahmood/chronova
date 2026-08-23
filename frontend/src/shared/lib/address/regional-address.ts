import type { AddressCountryCode } from "@/shared/lib/address/iraq-address";
import {
  DEFAULT_ADDRESS_COUNTRY,
  DEFAULT_GOVERNORATE,
} from "@/shared/lib/address/iraq-address";

export type RegionalAddress = {
  fullName: string;
  phone: string;
  countryCode: AddressCountryCode;
  governorate: string;
  city: string;
  district: string;
  street: string;
  details: string;
  postalCode: string;
};

export const EMPTY_REGIONAL_ADDRESS: RegionalAddress = {
  fullName: "",
  phone: "",
  countryCode: DEFAULT_ADDRESS_COUNTRY,
  governorate: "",
  city: "",
  district: "",
  street: "",
  details: "",
  postalCode: "",
};

type LegacyAddress = {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  countryCode?: AddressCountryCode;
  governorate?: string;
  district?: string;
  street?: string;
  details?: string;
};

export function migrateToRegionalAddress(
  value: LegacyAddress | null | undefined,
): RegionalAddress | null {
  if (!value) {
    return null;
  }

  if (value.countryCode && value.governorate !== undefined) {
    return {
      fullName: value.fullName ?? "",
      phone: value.phone ?? "",
      countryCode: value.countryCode,
      governorate: value.governorate || DEFAULT_GOVERNORATE,
      city: value.city ?? "",
      district: value.district ?? "",
      street: value.street ?? "",
      details: value.details ?? "",
      postalCode: value.postalCode ?? "",
    };
  }

  const country = value.country?.toLowerCase() ?? "";
  const countryCode: AddressCountryCode =
    country === "iraq" || country === "العراق" || country === "عێراق"
      ? "iraq"
      : DEFAULT_ADDRESS_COUNTRY;

  return {
    fullName: value.fullName ?? "",
    phone: value.phone ?? "",
    countryCode,
    governorate: value.state ?? DEFAULT_GOVERNORATE,
    city: value.city ?? "",
    district: "",
    street: value.line1 ?? value.street ?? "",
    details: value.line2 ?? value.details ?? "",
    postalCode: value.postalCode ?? "",
  };
}

export function formatRegionalAddress(
  address: RegionalAddress,
  t: (key: string) => string,
): string[] {
  const countryLabel =
    address.countryCode === "iraq"
      ? t("address.countryIraq")
      : t("address.countryKurdistanRegion");
  const governorateLabel = address.governorate
    ? t(`address.governorates.${address.governorate}`)
    : "";

  const lines = [
    address.fullName,
    address.phone,
    address.street,
    address.details,
    [address.district, address.city].filter(Boolean).join(", "),
    [governorateLabel, countryLabel].filter(Boolean).join(", "),
    address.postalCode,
  ].filter(Boolean);

  return lines;
}
