"use client";

import { useTranslation } from "@/shared/i18n";

export function PaymentMethodSection() {
  const { t } = useTranslation();

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("checkout.payment")}
        </h2>
        <p className="mt-1 text-sm text-secondary">{t("checkout.paymentDesc")}</p>
      </div>

      <div className="rounded-xl border border-border bg-card px-3.5 py-3.5 shadow-sm">
        <p className="text-sm font-medium">{t("checkout.paymentMethods.cod")}</p>
        <p className="mt-1 text-sm leading-relaxed text-secondary">
          {t("checkout.codNote")}
        </p>
      </div>
    </section>
  );
}
