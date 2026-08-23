"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CURRENCIES, type CurrencyCode } from "@/features/currency/constants/currency";
import { useCurrency } from "@/features/currency/context/CurrencyProvider";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type CurrencySelectorProps = {
  className?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn(
        "h-3.5 w-3.5 text-secondary/70 transition-transform duration-200",
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

export function CurrencySelector({ className }: CurrencySelectorProps) {
  const { currency, setCurrency, isHydrated } = useCurrency();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const options = Object.keys(CURRENCIES) as CurrencyCode[];

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

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "h-8 w-[4.5rem] rounded-full border border-border/80 bg-background/80",
          className,
        )}
        aria-hidden
      />
    );
  }

  function selectCurrency(code: CurrencyCode) {
    setCurrency(code);
    setOpen(false);
  }

  function getCurrencyLabel(code: CurrencyCode): string {
    return code === "USD" ? t("currency.usDollar") : t("currency.iraqiDinar");
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1.5",
          "text-[11px] font-medium uppercase tracking-[0.12em] text-foreground",
          "transition-all duration-200 hover:border-accent/40 hover:bg-card",
          open && "border-accent/40 bg-card ring-1 ring-accent/15",
        )}
      >
        <span>{currency}</span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("currency.choose")}
          className="absolute right-0 top-[calc(100%+0.375rem)] z-50 min-w-[10.5rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-[0_12px_40px_-12px_rgba(17,17,17,0.18)]"
        >
        {options.map((code) => {
          const isSelected = currency === code;

          return (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectCurrency(code)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors",
                  isSelected
                    ? "bg-accent/8 text-foreground"
                    : "text-secondary hover:bg-background hover:text-foreground",
                )}
              >
                <span>
                  <span
                    className={cn(
                      "block text-[11px] font-medium uppercase tracking-[0.12em]",
                      isSelected && "text-accent",
                    )}
                  >
                    {code}
                  </span>
                  <span className="mt-0.5 block text-[10px] normal-case tracking-normal text-secondary">
                    {getCurrencyLabel(code)}
                  </span>
                </span>
                {isSelected ? (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
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
