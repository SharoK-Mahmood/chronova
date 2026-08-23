import type { Metadata } from "next";

import { AccountDashboard } from "@/features/auth";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Chronova account.",
};

export default function AccountPage() {
  return <AccountDashboard />;
}
