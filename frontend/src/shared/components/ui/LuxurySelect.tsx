"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils/cn";

export type LuxurySelectOption = {
  value: string;
  label: string;
};

type LuxurySelectProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: LuxurySelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  listClassName?: string;
  ariaLabel?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 text-secondary/70 transition-transform duration-200",
        open && "rotate-180",
      )}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LuxurySelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  className,
  listClassName,
  ariaLabel,
}: LuxurySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectOption(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? (
        <input type="hidden" name={name} value={value} required={required && !value} />
      ) : null}

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm outline-none transition-colors",
          "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
          open && "border-accent/40 ring-2 ring-accent/20",
          !selected && "text-secondary",
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className={cn(
            "absolute inset-x-0 top-[calc(100%+0.375rem)] z-50 max-h-60 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)]",
            listClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-accent/8 font-medium text-accent"
                      : "text-secondary hover:bg-background hover:text-foreground",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
