"use client";

import { useMemo, useState } from "react";

import {
  CASE_SPEC_FIELDS,
  HANDS_SPEC_FIELDS,
  MOVEMENT_SPEC_FIELDS,
  hasAnyProductDetails,
  normalizeProductDetails,
  type ProductDetails,
} from "@/features/products/types/product-details.types";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type ProductDetailsPanelProps = {
  details?: ProductDetails | null;
  brand: string;
};

type SpecTab = "case" | "movement" | "hands";

function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8"
        >
          <dt className="text-sm text-secondary">{row.label}</dt>
          <dd className="text-sm text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductDetailsPanel({
  details,
  brand,
}: ProductDetailsPanelProps) {
  const { t } = useTranslation();
  const normalized = normalizeProductDetails(details);
  const [tab, setTab] = useState<SpecTab>("case");

  const caseRows = useMemo(
    () =>
      CASE_SPEC_FIELDS.map((field) => ({
        label: t(field.labelKey),
        value: normalized.case[field.key] ?? "",
      })).filter((row) => row.value),
    [normalized.case, t],
  );

  const movementRows = useMemo(
    () =>
      MOVEMENT_SPEC_FIELDS.map((field) => ({
        label: t(field.labelKey),
        value: normalized.movement[field.key] ?? "",
      })).filter((row) => row.value),
    [normalized.movement, t],
  );

  const handsRows = useMemo(
    () =>
      HANDS_SPEC_FIELDS.map((field) => ({
        label: t(field.labelKey),
        value: normalized.hands[field.key] ?? "",
      })).filter((row) => row.value),
    [normalized.hands, t],
  );

  if (!hasAnyProductDetails(normalized)) {
    return null;
  }

  const tabs = (
    [
      { id: "case", label: t("products.specs.case"), count: caseRows.length },
      {
        id: "movement",
        label: t("products.specs.movement"),
        count: movementRows.length,
      },
      {
        id: "hands",
        label: t("products.specs.hands"),
        count: handsRows.length,
      },
    ] as const satisfies ReadonlyArray<{
      id: SpecTab;
      label: string;
      count: number;
    }>
  ).filter((entry) => entry.count > 0);

  const activeRows =
    tab === "case"
      ? caseRows
      : tab === "movement"
        ? movementRows
        : handsRows;

  return (
    <div className="mt-16 space-y-10 border-t border-border pt-12">
      {tabs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
            {t("products.specs.title")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-6 border-b border-border">
            {tabs.map((entry) => {
              const selected = tab === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setTab(entry.id)}
                  className={cn(
                    "relative pb-3 text-sm uppercase tracking-[0.18em] transition-colors",
                    selected
                      ? "text-foreground"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  {entry.label}
                  {selected ? (
                    <span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mt-2">
            <SpecTable rows={activeRows} />
          </div>
        </section>
      ) : null}

      {normalized.care ? (
        <section className="max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em]">
            {t("products.care.title", { brand })}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            {normalized.care}
          </p>
        </section>
      ) : null}

      {normalized.giftWrapping ? (
        <section className="max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em]">
            {t("products.giftWrapping.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            {normalized.giftWrapping}
          </p>
        </section>
      ) : null}

      {normalized.shippingReturns ? (
        <section className="max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em]">
            {t("products.shippingReturns.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            {normalized.shippingReturns}
          </p>
        </section>
      ) : null}
    </div>
  );
}
