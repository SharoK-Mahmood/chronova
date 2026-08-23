import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

type CheckoutSectionProps = {
  title: string;
  description?: string;
  step?: number;
  children: ReactNode;
  className?: string;
};

export function CheckoutSection({
  title,
  description,
  step,
  children,
  className,
}: CheckoutSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      <div className="mb-6 flex items-start gap-4">
        {step ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-background">
            {step}
          </span>
        ) : null}
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-secondary">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
