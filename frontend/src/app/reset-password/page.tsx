import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Chronova account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
