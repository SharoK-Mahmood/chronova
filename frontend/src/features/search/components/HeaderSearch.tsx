"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SearchDropdown } from "@/features/search/components/SearchDropdown";
import { buildSearchUrl } from "@/features/search/constants/search-categories";
import { searchCatalog } from "@/features/search/lib/search-catalog";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type HeaderSearchProps = {
  variant?: "desktop" | "mobile";
  className?: string;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3-3" />
    </svg>
  );
}

export function HeaderSearch({ variant = "desktop", className }: HeaderSearchProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isMobile = variant === "mobile";

  const results = useMemo(() => searchCatalog(query), [query]);
  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    router.push(buildSearchUrl(trimmed));
    setOpen(false);
  }

  function closeDropdown() {
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor={`search-${variant}`} className="sr-only">
          {t("search.label")}
        </label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border bg-background/80 transition-colors",
            isMobile
              ? "border-border px-4 py-3.5"
              : "border-border/80 px-3 py-2",
            open && "border-accent/40 bg-card ring-1 ring-accent/15",
          )}
        >
          <SearchIcon
            className={cn(
              "shrink-0 text-secondary",
              isMobile ? "h-5 w-5" : "h-3.5 w-3.5",
            )}
          />
          <input
            ref={inputRef}
            id={`search-${variant}`}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t("search.placeholder")}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-secondary/70",
              isMobile ? "text-base" : "text-[13px]",
            )}
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
      </form>

      {showDropdown ? (
        <SearchDropdown
          results={results}
          onNavigate={closeDropdown}
          className={cn(
            "absolute z-50 mt-2",
            isMobile ? "inset-x-0" : "left-0 right-0 min-w-[20rem]",
          )}
        />
      ) : null}
    </div>
  );
}
