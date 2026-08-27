import { Suspense } from "react";
import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Chronova account.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
