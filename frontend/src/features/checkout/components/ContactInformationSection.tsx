import type { ContactInformation } from "@/features/checkout/types/checkout.types";
import { CheckoutSection } from "@/features/checkout/components/CheckoutSection";
import { FormField } from "@/features/checkout/components/FormField";
import { Input } from "@/shared/components/ui/Input";

type ContactInformationSectionProps = {
  value: ContactInformation;
  onChange: (value: ContactInformation) => void;
};

export function ContactInformationSection({
  value,
  onChange,
}: ContactInformationSectionProps) {
  return (
    <CheckoutSection
      step={1}
      title="Contact information"
      description="We'll send your order confirmation and delivery updates here."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email address" htmlFor="checkout-email" required>
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
        <FormField label="Phone number" htmlFor="checkout-phone" required>
          <Input
            id="checkout-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            required
            value={value.phone}
            onChange={(event) =>
              onChange({ ...value, phone: event.target.value })
            }
          />
        </FormField>
      </div>
    </CheckoutSection>
  );
}
