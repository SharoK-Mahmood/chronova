"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteProduct,
  listProducts,
} from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/product.types";
import { Button } from "@/shared/components/ui/Button";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";
import { Price } from "@/features/currency";

export function AdminProductsContent() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      setProducts(await listProducts());
      setError(null);
    } catch {
      setError(t("admin.loadError"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(product: Product) {
    if (!window.confirm(t("admin.confirmDelete"))) {
      return;
    }

    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((entry) => entry.id !== product.id));
    } catch {
      setError(t("admin.loadError"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={typography.page}>{t("admin.products")}</h2>
        <Button href="/admin/products/new" variant="accent">
          {t("admin.createProduct")}
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <p className="mt-8 text-secondary">{t("common.loading")}</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-secondary">{t("admin.emptyProducts")}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">{t("admin.name")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.brand")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.category")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.priceUsd")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.inStock")}</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-secondary">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    <Price amountUsd={product.price} />
                  </td>
                  <td className="px-4 py-3">
                    {product.inStock ? t("admin.inStock") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        {t("admin.editProduct")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product)}
                        className="text-red-700 hover:underline"
                      >
                        {t("admin.deleteProduct")}
                      </button>
                    </div>
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
