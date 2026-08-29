"use client";

import { useEffect, useId } from "react";

import { Button } from "@/shared/components/ui/Button";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type DeleteProductDialogProps = {
  open: boolean;
  /** One or more products about to be deleted. */
  products: Array<{ id: string; name: string }>;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteProductDialog({
  open,
  products,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const count = products.length;
  const isBulk = count > 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDeleting, onCancel, open]);

  if (!open || count === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={t("admin.deleteDialog.cancel")}
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        disabled={isDeleting}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-red-700/80">
          {t("admin.deleteDialog.eyebrow")}
        </p>
        <h2
          id={titleId}
          className={cn("mt-2 text-lg font-semibold tracking-tight")}
        >
          {isBulk
            ? t("admin.deleteDialog.titleBulk", { count: String(count) })
            : t("admin.deleteDialog.title", { name: products[0].name })}
        </h2>
        <p
          id={descriptionId}
          className={cn("mt-3 text-secondary", typography.body)}
        >
          {isBulk
            ? t("admin.deleteDialog.descriptionBulk")
            : t("admin.deleteDialog.description")}
        </p>
        {isBulk ? (
          <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
            {products.map((product) => (
              <li key={product.id} className="truncate text-primary">
                {product.name}
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-4 space-y-2 border-s-2 border-red-200 ps-3 text-sm text-secondary">
          <li>{t("admin.deleteDialog.itemRecord")}</li>
          <li>{t("admin.deleteDialog.itemImages")}</li>
          <li>{t("admin.deleteDialog.itemFolder")}</li>
        </ul>
        <p className="mt-4 text-sm font-medium text-primary">
          {t("admin.deleteDialog.warning")}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
          <Button
            type="button"
            className="w-full border-transparent bg-red-700 text-white hover:bg-red-800 hover:ring-red-200 sm:w-auto"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting
              ? t("admin.deleteDialog.deleting")
              : isBulk
                ? t("admin.deleteDialog.confirmBulk", { count: String(count) })
                : t("admin.deleteDialog.confirm")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={isDeleting}
            autoFocus
            onClick={onCancel}
          >
            {t("admin.deleteDialog.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
