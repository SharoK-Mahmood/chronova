"use client";

import { AuthButton } from "@/features/auth/components/AuthButton";
import { GoogleIcon } from "@/features/auth/components/AuthIcons";

export function GoogleSignInButton() {
  return (
    <AuthButton href="/auth/google" variant="secondary" className="w-full gap-3">
      <GoogleIcon className="h-5 w-5" />
      Continue with Google
    </AuthButton>
  );
}
