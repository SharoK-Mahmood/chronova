import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/shared/components/ui/Button";

type AuthButtonProps = ComponentPropsWithoutRef<typeof Button>;

export function AuthButton(props: AuthButtonProps) {
  return <Button {...props} />;
}
