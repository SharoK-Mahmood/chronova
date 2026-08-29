"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DeleteProductDialog } from "@/features/admin/components/DeleteProductDialog";
import {
  deleteProduct,
  listProducts,
} from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/product.types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { type as typography } from "@/shared/lib/typography";
import { cn } from "@/shared/lib/utils/cn";
import { Price } from "@/features/currency";

function matchesProductQuery(product: Product, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const haystack = [
    product.name,
    product.brand,
    product.slug,
    product.category,
    product.reference,
    product.subtitle,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return normalized
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

export function AdminProductsContent() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesProductQuery(product, searchQuery)),
    [products, searchQuery],
  );

  const selectedCount = selectedIds.size;
  const filteredIds = filteredProducts.map((product) => product.id);
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected =
    filteredIds.some((id) => selectedIds.has(id)) && !allFilteredSelected;

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

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAllFiltered() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allFilteredSelected) {
        for (const id of filteredIds) {
          next.delete(id);
        }
      } else {
        for (const id of filteredIds) {
          next.add(id);
        }
      }
      return next;
    });
  }

  function requestDelete(productsToRemove: Product[]) {
    if (productsToRemove.length === 0) {
      return;
    }
    setPendingDelete(productsToRemove);
  }

  async function confirmDelete() {
    if (pendingDelete.length === 0) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const ids = pendingDelete.map((product) => product.id);
    const failedIds: string[] = [];

    for (const id of ids) {
      try {
        await deleteProduct(id);
      } catch {
        failedIds.push(id);
      }
    }

    const deletedIds = new Set(ids.filter((id) => !failedIds.includes(id)));

    setProducts((current) =>
      current.filter((entry) => !deletedIds.has(entry.id)),
    );
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const id of deletedIds) {
        next.delete(id);
      }
      return next;
    });
    setPendingDelete([]);
    setIsDeleting(false);

    if (failedIds.length > 0) {
      setError(t("admin.deleteFailed"));
    }
  }

  const selectedProducts = products.filter((product) =>
    selectedIds.has(product.id),
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <h2 className={typography.page}>{t("admin.products")}</h2>
        <Button
          href="/admin/products/new"
          variant="accent"
          className="w-full sm:w-auto"
        >
          {t("admin.createProduct")}
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      {!isLoading && products.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 sm:max-w-md">
            <label className="sr-only" htmlFor="admin-product-search">
              {t("admin.searchProducts")}
            </label>
            <Input
              id="admin-product-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("admin.searchProductsPlaceholder")}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-secondary">
              {searchQuery.trim()
                ? t("admin.searchResultsCount", {
                    count: String(filteredProducts.length),
                    total: String(products.length),
                  })
                : t("admin.productsListed", {
                    count: String(products.length),
                  })}
            </p>
            {selectedCount > 0 ? (
              <Button
                type="button"
                variant="secondary"
                className="w-full border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 sm:w-auto"
                onClick={() => requestDelete(selectedProducts)}
              >
                {t("admin.deleteSelected", { count: String(selectedCount) })}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <p className="mt-8 text-secondary">{t("common.loading")}</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-secondary">{t("admin.emptyProducts")}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-8 text-secondary">{t("admin.searchNoResults")}</p>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="mt-5 space-y-3 md:hidden">
            <label className="flex items-center gap-2 px-1 text-sm text-secondary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-accent"
                checked={allFilteredSelected}
                ref={(element) => {
                  if (element) {
                    element.indeterminate = someFilteredSelected;
                  }
                }}
                onChange={toggleSelectAllFiltered}
              />
              {t("admin.selectAll")}
            </label>
            {filteredProducts.map((product) => {
              const isSelected = selectedIds.has(product.id);

              return (
                <article
                  key={product.id}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-4",
                    isSelected && "border-accent/40 bg-accent/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent"
                      checked={isSelected}
                      onChange={() => toggleSelected(product.id)}
                      aria-label={t("admin.selectProduct", {
                        name: product.name,
                      })}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{product.name}</p>
                      <p className="mt-0.5 truncate text-xs text-secondary">
                        {product.slug}
                      </p>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        <div>
                          <dt className="text-xs text-secondary">
                            {t("admin.brand")}
                          </dt>
                          <dd className="truncate">{product.brand}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-secondary">
                            {t("admin.category")}
                          </dt>
                          <dd className="capitalize">{product.category}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-secondary">
                            {t("admin.priceUsd")}
                          </dt>
                          <dd>
                            <Price amountUsd={product.price} />
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-secondary">
                            {t("admin.inStock")}
                          </dt>
                          <dd>
                            {product.inStock ? t("admin.inStock") : "—"}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3 text-sm">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-accent hover:underline"
                        >
                          {t("admin.editProduct")}
                        </Link>
                        <button
                          type="button"
                          onClick={() => requestDelete([product])}
                          className="text-red-700 hover:underline"
                        >
                          {t("admin.deleteProduct")}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.2em] text-secondary">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-accent"
                      checked={allFilteredSelected}
                      ref={(element) => {
                        if (element) {
                          element.indeterminate = someFilteredSelected;
                        }
                      }}
                      onChange={toggleSelectAllFiltered}
                      aria-label={t("admin.selectAll")}
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">{t("admin.name")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.brand")}</th>
                  <th className="px-4 py-3 font-medium">
                    {t("admin.category")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("admin.priceUsd")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("admin.inStock")}
                  </th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.has(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={cn(isSelected && "bg-accent/5")}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border text-accent"
                          checked={isSelected}
                          onChange={() => toggleSelected(product.id)}
                          aria-label={t("admin.selectProduct", {
                            name: product.name,
                          })}
                        />
                      </td>
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
                            onClick={() => requestDelete([product])}
                            className="text-red-700 hover:underline"
                          >
                            {t("admin.deleteProduct")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <DeleteProductDialog
        open={pendingDelete.length > 0}
        products={pendingDelete.map((product) => ({
          id: product.id,
          name: product.name,
        }))}
        isDeleting={isDeleting}
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={() => {
          if (!isDeleting) {
            setPendingDelete([]);
          }
        }}
      />
    </div>
  );
}
