import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Chronova account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
