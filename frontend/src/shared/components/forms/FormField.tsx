import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
};

export function FormField({
  label,
  htmlFor,
  children,
  required = false,
  className,
  labelClassName = "block text-sm font-medium",
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
