import type { Metadata } from "next";

import { AdminOrdersContent } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin orders",
};

export default function AdminOrdersPage() {
  return <AdminOrdersContent />;
}
