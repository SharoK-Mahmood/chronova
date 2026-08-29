"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getAdminOverview,
  type AdminOverview,
} from "@/features/checkout/services/orders.service";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";

export function AdminOverviewContent() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAdminOverview()
      .then(setOverview)
      .catch(() => setError(t("admin.loadError")));
  }, [t]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!overview) {
    return <p className="text-secondary">{t("common.loading")}</p>;
  }

  const cards = [
    { label: t("admin.productsCount"), value: overview.products, href: "/admin/products" },
    { label: t("admin.ordersCount"), value: overview.orders, href: "/admin/orders" },
    {
      label: t("admin.statuses.confirmed"),
      value: overview.ordersByStatus.confirmed,
      href: "/admin/orders",
    },
    {
      label: t("admin.statuses.processing"),
      value: overview.ordersByStatus.processing,
      href: "/admin/orders",
    },
    {
      label: t("admin.statuses.shipped"),
      value: overview.ordersByStatus.shipped,
      href: "/admin/orders",
    },
    {
      label: t("admin.statuses.delivered"),
      value: overview.ordersByStatus.delivered,
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h2 className={typography.page}>{t("admin.overview")}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-accent/40 sm:p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent sm:text-xs sm:tracking-[0.25em]">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
