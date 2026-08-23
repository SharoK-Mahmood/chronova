import { CheckoutContent } from "@/features/checkout";
import { createSectionMetadata } from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Checkout",
  "Complete your Chronova purchase securely.",
);

export default function CheckoutPage() {
  return <CheckoutContent />;
}
