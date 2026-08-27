"use client";

import { useEffect, useId } from "react";

import { Button } from "@/shared/components/ui/Button";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type UnsavedChangesDialogProps = {
  open: boolean;
  isSaving: boolean;
  onSave: () => void;
  onLeave: () => void;
  onStay: () => void;
};

export function UnsavedChangesDialog({
  open,
  isSaving,
  onSave,
  onLeave,
  onStay,
}: UnsavedChangesDialogProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSaving) {
        onStay();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSaving, onStay, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={t("account.leaveDialog.stay")}
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        disabled={isSaving}
        onClick={onStay}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6"
      >
        <h2 id={titleId} className={cn("text-lg font-semibold tracking-tight")}>
          {t("account.leaveDialog.title")}
        </h2>
        <p
          id={descriptionId}
          className={cn("mt-2 text-secondary", typography.body)}
        >
          {t("account.leaveDialog.description")}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:flex-wrap sm:justify-start">
          <Button
            type="button"
            variant="accent"
            className="w-full sm:w-auto"
            disabled={isSaving}
            onClick={onSave}
          >
            {isSaving
              ? t("account.saving")
              : t("account.leaveDialog.saveAndLeave")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={isSaving}
            onClick={onLeave}
          >
            {t("account.leaveDialog.leaveWithoutSaving")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            disabled={isSaving}
            autoFocus
            onClick={onStay}
          >
            {t("account.leaveDialog.stay")}
          </Button>
        </div>
      </div>
    </div>
  );
}
