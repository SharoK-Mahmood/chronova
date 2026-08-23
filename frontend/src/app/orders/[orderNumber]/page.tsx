import { OrderTrackingContent } from "@/features/checkout";
import { createSectionMetadata } from "@/shared/components/layout/SectionPage";

type OrderTrackingPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: OrderTrackingPageProps) {
  const { orderNumber } = await params;

  return createSectionMetadata(
    "Track Order",
    `Track order ${orderNumber}.`,
  );
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderNumber } = await params;

  return <OrderTrackingContent orderNumber={orderNumber} />;
}
