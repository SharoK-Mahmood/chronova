"use client";

import type { SavedAddress } from "@/features/account/types/account-settings.types";
import { RegionalAddressForm } from "@/shared/components/forms/RegionalAddressForm";
import { EMPTY_REGIONAL_ADDRESS } from "@/shared/lib/address/regional-address";

type AddressFormProps = {
  value: SavedAddress;
  onChange: (value: SavedAddress) => void;
  prefix: string;
};

export function AddressForm({ value, onChange, prefix }: AddressFormProps) {
  return (
    <RegionalAddressForm
      value={value}
      onChange={onChange}
      prefix={prefix}
      variant="account"
    />
  );
}

export const EMPTY_ADDRESS: SavedAddress = EMPTY_REGIONAL_ADDRESS;
