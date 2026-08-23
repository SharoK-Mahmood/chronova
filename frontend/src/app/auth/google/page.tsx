import type { Metadata } from "next";

import { GoogleAuthForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in with Google",
  description: "Continue to Chronova with your Google account.",
};

export default function GoogleAuthPage() {
  return <GoogleAuthForm />;
}
