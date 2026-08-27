"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

type SelectableOptionRowProps = {
  selected: boolean;
  onSelect: () => void;
  label: string;
  description?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
};

export function SelectableOptionRow({
  selected,
  onSelect,
  label,
  description,
  trailing,
  children,
}: SelectableOptionRowProps) {
  return (
    <div className={cn(selected ? "bg-background/70" : "bg-card")}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-3 text-start transition-colors",
          !selected && "hover:bg-background/40",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 shrink-0 rounded-full border-2",
            selected ? "border-accent bg-accent" : "border-border",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-xs text-secondary">
              {description}
            </span>
          ) : null}
        </span>
        {trailing ? <span className="shrink-0">{trailing}</span> : null}
      </button>
      {selected && children ? (
        <div className="border-t border-border px-3.5 pb-3.5 pt-3">{children}</div>
      ) : null}
    </div>
  );
}

type SelectableOptionListProps = {
  children: ReactNode;
  className?: string;
};

export function SelectableOptionList({
  children,
  className,
}: SelectableOptionListProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border divide-y divide-border shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
