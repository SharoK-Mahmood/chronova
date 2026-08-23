import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type SettingsSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SettingsSection({
  id,
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8",
        className,
      )}
    >
      <div className="mb-6 border-b border-border pb-5">
        <h2 className={typography.section}>{title}</h2>
        {description ? (
          <p className={cn("mt-1 text-secondary", typography.body)}>{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
