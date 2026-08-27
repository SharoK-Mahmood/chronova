import type { Metadata } from "next";

import { AdminProductForm } from "@/features/admin";

export const metadata: Metadata = {
  title: "Add product",
};

export default function AdminNewProductPage() {
  return <AdminProductForm />;
}
