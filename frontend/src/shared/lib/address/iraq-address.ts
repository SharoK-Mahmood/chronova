export type AddressCountryCode = "iraq" | "kurdistan-region";

export type AddressRegion = {
  code: AddressCountryCode;
  labelKey: "address.country.iraq" | "address.country.kurdistanRegion";
};

export const ADDRESS_REGIONS: AddressRegion[] = [
  { code: "kurdistan-region", labelKey: "address.country.kurdistanRegion" },
  { code: "iraq", labelKey: "address.country.iraq" },
];

/** Kurdistan Region governorates (shown first when that region is selected). */
export const KURDISTAN_GOVERNORATE_KEYS = [
  "erbil",
  "sulaymaniyah",
  "dohuk",
  "halabja",
] as const;

/** All Iraqi governorates (18 official + Halabja). */
export const ALL_IRAQI_GOVERNORATE_KEYS = [
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
] as const;

export type GovernorateKey = (typeof ALL_IRAQI_GOVERNORATE_KEYS)[number];

/**
 * Full list for both regions so every Iraqi governorate is always selectable.
 * Kurdistan Region puts KRI governorates first for convenience.
 */
export const GOVERNORATE_KEYS: Record<AddressCountryCode, string[]> = {
  "kurdistan-region": [
    ...KURDISTAN_GOVERNORATE_KEYS,
    ...ALL_IRAQI_GOVERNORATE_KEYS.filter(
      (key) =>
        !(KURDISTAN_GOVERNORATE_KEYS as readonly string[]).includes(key),
    ),
  ],
  iraq: [...ALL_IRAQI_GOVERNORATE_KEYS],
};

export const DEFAULT_ADDRESS_COUNTRY: AddressCountryCode = "kurdistan-region";
export const DEFAULT_GOVERNORATE = "erbil";
