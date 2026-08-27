"use client";

import { useEffect, useState } from "react";

import {
  listOrders,
  updateOrderStatus,
} from "@/features/checkout/services/orders.service";
import type { PlacedOrder } from "@/features/checkout/types/checkout.types";
import { Price } from "@/features/currency";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";

const STATUSES: PlacedOrder["status"][] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export function AdminOrdersContent() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    void listOrders()
      .then(setOrders)
      .catch(() => setError(t("admin.loadError")))
      .finally(() => setIsLoading(false));
  }, [t]);

  async function handleStatusChange(
    orderNumber: string,
    status: PlacedOrder["status"],
  ) {
    setUpdating(orderNumber);
    setError(null);

    try {
      const updated = await updateOrderStatus(orderNumber, status);
      setOrders((current) =>
        current.map((order) =>
          order.orderNumber === orderNumber ? updated : order,
        ),
      );
    } catch {
      setError(t("admin.loadError"));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <h2 className={typography.page}>{t("admin.orders")}</h2>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <p className="mt-8 text-secondary">{t("common.loading")}</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-secondary">{t("admin.emptyOrders")}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">{t("admin.customer")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.placedAt")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.total")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.orderNumber}>
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p>{order.contact.email}</p>
                    <p className="text-xs text-secondary">
                      {order.lineItems.length}{" "}
                      {order.lineItems.length === 1
                        ? t("common.item")
                        : t("common.items")}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.placedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Price amountUsd={order.totalUsd} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      disabled={updating === order.orderNumber}
                      onChange={(event) =>
                        void handleStatusChange(
                          order.orderNumber,
                          event.target.value as PlacedOrder["status"],
                        )
                      }
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t(`admin.statuses.${status}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
