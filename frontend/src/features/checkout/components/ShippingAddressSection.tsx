import type { ShippingAddress } from "@/features/checkout/types/checkout.types";
import { CheckoutSection } from "@/features/checkout/components/CheckoutSection";
import { FormField } from "@/features/checkout/components/FormField";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/utils/cn";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "United Arab Emirates",
  "Iraq",
  "Switzerland",
  "Singapore",
  "Australia",
] as const;

type ShippingAddressSectionProps = {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
};

const selectClassName = cn(
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors",
  "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
);

export function ShippingAddressSection({
  value,
  onChange,
}: ShippingAddressSectionProps) {
  function updateField<K extends keyof ShippingAddress>(
    field: K,
    fieldValue: ShippingAddress[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <CheckoutSection
      step={2}
      title="Shipping address"
      description="Your timepiece will be delivered to this address."
    >
      <div className="grid gap-5">
        <FormField label="Full name" htmlFor="checkout-full-name" required>
          <Input
            id="checkout-full-name"
            name="fullName"
            autoComplete="name"
            placeholder="Jane Doe"
            required
            value={value.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </FormField>

        <FormField label="Address line 1" htmlFor="checkout-line1" required>
          <Input
            id="checkout-line1"
            name="line1"
            autoComplete="address-line1"
            placeholder="Street address"
            required
            value={value.line1}
            onChange={(event) => updateField("line1", event.target.value)}
          />
        </FormField>

        <FormField label="Address line 2" htmlFor="checkout-line2">
          <Input
            id="checkout-line2"
            name="line2"
            autoComplete="address-line2"
            placeholder="Apartment, suite, etc. (optional)"
            value={value.line2}
            onChange={(event) => updateField("line2", event.target.value)}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="City" htmlFor="checkout-city" required>
            <Input
              id="checkout-city"
              name="city"
              autoComplete="address-level2"
              required
              value={value.city}
              onChange={(event) => updateField("city", event.target.value)}
            />
          </FormField>
          <FormField label="State / Province" htmlFor="checkout-state" required>
            <Input
              id="checkout-state"
              name="state"
              autoComplete="address-level1"
              required
              value={value.state}
              onChange={(event) => updateField("state", event.target.value)}
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Postal code" htmlFor="checkout-postal" required>
            <Input
              id="checkout-postal"
              name="postalCode"
              autoComplete="postal-code"
              required
              value={value.postalCode}
              onChange={(event) => updateField("postalCode", event.target.value)}
            />
          </FormField>
          <FormField label="Country" htmlFor="checkout-country" required>
            <select
              id="checkout-country"
              name="country"
              autoComplete="country-name"
              required
              className={selectClassName}
              value={value.country}
              onChange={(event) => updateField("country", event.target.value)}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>
    </CheckoutSection>
  );
}
