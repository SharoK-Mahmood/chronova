import { OrderConfirmationContent } from "@/features/checkout";
import { createSectionMetadata } from "@/shared/components/layout/SectionPage";

type ConfirmationPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;

  return createSectionMetadata(
    "Order Confirmation",
    `Confirmation for order ${orderNumber}.`,
  );
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { orderNumber } = await params;

  return <OrderConfirmationContent orderNumber={orderNumber} />;
}
