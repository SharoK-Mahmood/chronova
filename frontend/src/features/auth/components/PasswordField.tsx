"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "@/features/auth/components/AuthIcons";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/utils/cn";

type PasswordFieldProps = {
  id: string;
  name: string;
  label?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export function PasswordField({
  id,
  name,
  label,
  autoComplete = "current-password",
  placeholder = "Enter your password",
  required = true,
  className,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-secondary transition-all duration-200 hover:scale-110 hover:bg-background hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
