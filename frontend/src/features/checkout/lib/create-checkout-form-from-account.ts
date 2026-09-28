import type { AccountSettings } from "@/features/account/types/account-settings.types";
import type { User } from "@/features/auth/types/auth.types";
import { formatUserDisplayName } from "@/features/auth/lib/format-user-name";
import { EMPTY_CARD_PAYMENT } from "@/features/checkout/constants/default-checkout-form";
import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { EMPTY_REGIONAL_ADDRESS } from "@/shared/lib/address/regional-address";

/** Prefill checkout from the signed-in account — delivery + payment stay editable. */
export function createCheckoutFormFromAccount(
  settings: AccountSettings,
  user: Pick<User, "firstName" | "lastName" | "email">,
): CheckoutFormData {
  const saved = settings.shippingAddress;
  const displayName = formatUserDisplayName(user);

  return {
    shippingAddress: {
      ...(saved ?? EMPTY_REGIONAL_ADDRESS),
      fullName: saved?.fullName.trim() || displayName,
    },
    deliveryMethodId: "standard",
    paymentMethodId: "cod",
    cardPayment: { ...EMPTY_CARD_PAYMENT },
  };
}
