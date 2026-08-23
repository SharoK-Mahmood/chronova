import {
  SectionPage,
  createSectionMetadata,
} from "@/shared/components/layout/SectionPage";

export const metadata = createSectionMetadata(
  "Checkout",
  "Complete your Chronova purchase.",
);

export default function CheckoutPage() {
  return (
    <SectionPage
      title="Checkout"
      description="Secure checkout is coming soon. Review your cart and check back shortly."
    />
  );
}
