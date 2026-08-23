import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your Chronova account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
