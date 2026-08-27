"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import {
  createProduct,
  updateProduct,
  type ProductWriteInput,
} from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/product.types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { ApiClientError } from "@/shared/lib/api/client";
import { type as typography } from "@/shared/lib/typography";

type AdminProductFormProps = {
  product?: Product;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminProductForm({ product }: AdminProductFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: ProductWriteInput = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      category: String(formData.get("category") ?? ""),
      description: String(formData.get("description") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      price: Number(formData.get("price")),
      currency: "USD",
      inStock: formData.get("inStock") === "on",
      reference: String(formData.get("reference") ?? "") || null,
      subtitle: String(formData.get("subtitle") ?? "") || null,
    };

    setIsSubmitting(true);

    try {
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : t("admin.loadError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className={typography.page}>
        {product ? t("admin.editProduct") : t("admin.createProduct")}
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
        <Field label={t("admin.name")} htmlFor="name">
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            onChange={(event) => {
              if (slugTouched) {
                return;
              }

              const slugInput = document.getElementById("slug") as HTMLInputElement | null;
              if (slugInput) {
                slugInput.value = slugify(event.target.value);
              }
            }}
          />
        </Field>

        <Field label={t("admin.slug")} htmlFor="slug">
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            required
            onChange={() => setSlugTouched(true)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("admin.brand")} htmlFor="brand">
            <Input id="brand" name="brand" defaultValue={product?.brand} required />
          </Field>
          <Field label={t("admin.category")} htmlFor="category">
            <Input
              id="category"
              name="category"
              defaultValue={product?.category ?? "watches"}
              required
            />
          </Field>
        </div>

        <Field label={t("admin.priceUsd")} htmlFor="price">
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            defaultValue={product?.price}
            required
          />
        </Field>

        <Field label={t("admin.imageUrl")} htmlFor="imageUrl">
          <Input
            id="imageUrl"
            name="imageUrl"
            defaultValue={product?.imageUrl}
            required
          />
        </Field>

        <Field label={t("admin.subtitle")} htmlFor="subtitle">
          <Input id="subtitle" name="subtitle" defaultValue={product?.subtitle} />
        </Field>

        <Field label={t("admin.reference")} htmlFor="reference">
          <Input id="reference" name="reference" defaultValue={product?.reference} />
        </Field>

        <Field label={t("admin.description")} htmlFor="description">
          <textarea
            id="description"
            name="description"
            required
            defaultValue={product?.description}
            className="min-h-32 w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          />
        </Field>

        <label htmlFor="inStock" className="flex items-center gap-3 text-sm">
          <input
            id="inStock"
            name="inStock"
            type="checkbox"
            defaultChecked={product?.inStock ?? true}
            className="h-4 w-4 rounded border-border text-accent"
          />
          {t("admin.inStock")}
        </label>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? t("admin.saving") : t("admin.saveProduct")}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
