import type { Metadata } from "next";

import { AdminProductsContent } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin products",
};

export default function AdminProductsPage() {
  return <AdminProductsContent />;
}
