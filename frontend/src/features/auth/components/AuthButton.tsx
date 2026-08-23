import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/utils/cn";
import type { ComponentPropsWithoutRef } from "react";

type AuthButtonProps = ComponentPropsWithoutRef<typeof Button>;

export function AuthButton({ className, ...props }: AuthButtonProps) {
  return (
    <Button
      className={cn(
        "transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
      {...props}
    />
  );
}
