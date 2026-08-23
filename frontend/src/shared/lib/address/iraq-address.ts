export type AddressCountryCode = "iraq" | "kurdistan-region";

export type AddressRegion = {
  code: AddressCountryCode;
  labelKey: "address.country.iraq" | "address.country.kurdistanRegion";
};

export const ADDRESS_REGIONS: AddressRegion[] = [
  { code: "kurdistan-region", labelKey: "address.country.kurdistanRegion" },
  { code: "iraq", labelKey: "address.country.iraq" },
];

export const GOVERNORATE_KEYS: Record<AddressCountryCode, string[]> = {
  "kurdistan-region": ["erbil", "sulaymaniyah", "dohuk", "halabja"],
  iraq: [
    "baghdad",
    "basra",
    "nineveh",
    "erbil",
    "sulaymaniyah",
    "dohuk",
    "halabja",
    "kirkuk",
    "diyala",
    "anbar",
    "najaf",
    "karbala",
    "wasit",
    "babil",
    "maysan",
    "dhiQar",
    "muthanna",
    "qadisiyyah",
    "salahAlDin",
  ],
};

export const DEFAULT_ADDRESS_COUNTRY: AddressCountryCode = "kurdistan-region";
export const DEFAULT_GOVERNORATE = "erbil";
