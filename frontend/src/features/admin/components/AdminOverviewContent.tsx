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
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-accent/40"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
