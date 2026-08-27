import type { Metadata } from "next";

import { AdminOverviewContent } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin",
  description: "Chronova admin dashboard.",
};

export default function AdminPage() {
  return <AdminOverviewContent />;
}
