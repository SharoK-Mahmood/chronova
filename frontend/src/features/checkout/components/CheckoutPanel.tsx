"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

type CheckoutPanelProps = {
  id: string;
  step: number;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Shared chrome for checkout step panels (Open/Closed: reuse, don't copy). */
export function CheckoutPanel({
  id,
  step,
  title,
  children,
  className,
}: CheckoutPanelProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {step} · {title}
      </p>
      {children}
    </section>
  );
}
