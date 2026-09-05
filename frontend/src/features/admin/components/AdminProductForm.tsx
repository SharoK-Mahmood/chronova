"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import {
  createProduct,
  updateProduct,
  type ProductWriteInput,
} from "@/features/products/services/products.service";
import {
  deleteProductImage,
  uploadProductImages,
} from "@/features/products/services/uploads.service";
import type { Product } from "@/features/products/types/product.types";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import {
  CASE_SPEC_FIELDS,
  EMPTY_PRODUCT_DETAILS,
  HANDS_SPEC_FIELDS,
  MOVEMENT_SPEC_FIELDS,
  normalizeProductDetails,
  type ProductDetails,
} from "@/features/products/types/product-details.types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "@/shared/i18n";
import { ApiClientError } from "@/shared/lib/api/client";
import { getProductImageUrls } from "@/shared/lib/utils/product-image";
import { type as typography } from "@/shared/lib/typography";
import { cn } from "@/shared/lib/utils/cn";

type AdminProductFormProps = {
  product?: Product;
};

const textareaClassName =
  "min-h-28 w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20";

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
  const [isUploading, setIsUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState<"men" | "women" | "unisex">(
    product?.category === "women"
      ? "women"
      : product?.category === "unisex"
        ? "unisex"
        : "men",
  );
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    product ? getProductImageUrls(product) : [],
  );
  const [urlDraft, setUrlDraft] = useState("");
  const [details, setDetails] = useState<ProductDetails>(() =>
    normalizeProductDetails(product?.details ?? EMPTY_PRODUCT_DETAILS),
  );

  async function persistImageUrls(nextUrls: string[]) {
    setImageUrls(nextUrls);
    if (!product || nextUrls.length === 0) {
      return;
    }

    try {
      await updateProduct(product.id, {
        imageUrls: nextUrls,
        imageUrl: nextUrls[0],
      });
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("admin.imageUploadFailed"),
      );
    }
  }

  async function handleImagesSelected(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const modelSlug = slug.trim();
    if (!modelSlug) {
      setError(t("admin.slugRequiredForImages"));
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadProductImages(Array.from(files), modelSlug);
      const nextUrls = [...imageUrls, ...uploaded.imageUrls];
      await persistImageUrls(nextUrls);
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("admin.imageUploadFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  }

  function addImageUrlFromDraft() {
    const next = urlDraft.trim();
    if (!next) {
      return;
    }

    const nextUrls = imageUrls.includes(next)
      ? imageUrls
      : [...imageUrls, next];
    setUrlDraft("");
    void persistImageUrls(nextUrls);
  }

  async function removeImageAt(index: number) {
    const previousUrls = imageUrls;
    const removedUrl = previousUrls[index];
    const nextUrls = previousUrls.filter((_, i) => i !== index);

    // Keep at least one image on existing products (DB requires a cover URL).
    if (product && nextUrls.length === 0) {
      setError(t("admin.imageRequired"));
      return;
    }

    setError(null);
    setImageUrls(nextUrls);

    try {
      if (product) {
        await updateProduct(product.id, {
          imageUrls: nextUrls,
          imageUrl: nextUrls[0],
        });
      }

      // updateProduct already deletes local files when URLs change; for create
      // (no product yet) delete the uploaded file explicitly.
      if (!product && removedUrl?.startsWith("/uploads/products/")) {
        await deleteProductImage(removedUrl);
      }
    } catch (cause) {
      setImageUrls(previousUrls);
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : t("admin.imageUploadFailed"),
      );
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= imageUrls.length) {
      return;
    }

    const nextUrls = [...imageUrls];
    const [item] = nextUrls.splice(index, 1);
    nextUrls.splice(target, 0, item);
    void persistImageUrls(nextUrls);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (imageUrls.length === 0) {
      setError(t("admin.imageRequired"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload: ProductWriteInput = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      category,
      description: String(formData.get("description") ?? ""),
      imageUrls,
      imageUrl: imageUrls[0],
      price: Number(formData.get("price")),
      currency: "USD",
      inStock: formData.get("inStock") === "on",
      reference: String(formData.get("reference") ?? "") || null,
      subtitle: String(formData.get("subtitle") ?? "") || null,
      details: normalizeProductDetails(details),
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
      <p className="mt-2 max-w-2xl text-sm text-secondary">
        {t("admin.productFormIntro")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-8">
        <FormSection title={t("admin.sectionBasics")}>
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

              setSlug(slugify(event.target.value));
            }}
          />
        </Field>

        <Field label={t("admin.slug")} htmlFor="slug">
          <Input
            id="slug"
            name="slug"
            value={slug}
            required
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value) || event.target.value);
            }}
          />
          <p className="mt-1 text-xs text-secondary">{t("admin.slugImageHint")}</p>
        </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("admin.brand")} htmlFor="brand">
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand}
                required
              />
            </Field>
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
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">{t("admin.category")}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["men", "women", "unisex"] as const).map((option) => {
                const selected = category === option;
                const label =
                  option === "men"
                    ? t("admin.categoryMen")
                    : option === "women"
                      ? t("admin.categoryWomen")
                      : t("admin.categoryUnisex");
                const hint =
                  option === "men"
                    ? t("admin.categoryMenHint")
                    : option === "women"
                      ? t("admin.categoryWomenHint")
                      : t("admin.categoryUnisexHint");

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      selected
                        ? "border-accent bg-accent/8 ring-1 ring-accent/20"
                        : "border-border hover:border-accent/30",
                    )}
                  >
                    <span className="font-medium">{label}</span>
                    <span className="mt-0.5 block text-xs text-secondary">
                      {hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Field label={t("admin.subtitle")} htmlFor="subtitle">
            <Input
              id="subtitle"
              name="subtitle"
              defaultValue={product?.subtitle}
              placeholder={t("admin.subtitlePlaceholder")}
            />
          </Field>

          <Field label={t("admin.reference")} htmlFor="reference">
            <Input
              id="reference"
              name="reference"
              defaultValue={product?.reference}
              placeholder={t("admin.referencePlaceholder")}
            />
          </Field>

          <Field label={t("admin.description")} htmlFor="description">
            <textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description}
              className={textareaClassName}
              placeholder={t("admin.descriptionPlaceholder")}
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
        </FormSection>

        <FormSection
          title={t("admin.productImages")}
          description={t("admin.productImagesHint")}
        >
          {!slug.trim() ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-secondary">
              {t("admin.slugRequiredForImages")}
            </p>
          ) : (
            <p className="text-xs text-secondary">
              {t("admin.imageLibraryPath", {
                path: `uploads/products/${slug.trim()}/`,
              })}
            </p>
          )}

          <Input
            id="image-files"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={isUploading || isSubmitting || !slug.trim()}
            onChange={(event) => {
              void handleImagesSelected(event.target.files);
              event.target.value = "";
            }}
          />

          {isUploading ? (
            <p className="text-xs text-secondary">{t("admin.uploadingImage")}</p>
          ) : null}

          {imageUrls.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {imageUrls.map((url, index) => (
                <li
                  key={`${url}-${index}`}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-square bg-white">
                    <ProductImage
                      src={url}
                      alt=""
                      fill
                      className="object-contain p-3"
                      sizes="240px"
                    />
                    {index === 0 ? (
                      <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
                        {t("admin.coverImage")}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t border-border p-2">
                    <button
                      type="button"
                      className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
                      disabled={index === 0 || isSubmitting}
                      onClick={() => moveImage(index, -1)}
                    >
                      {t("admin.moveImageUp")}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
                      disabled={index === imageUrls.length - 1 || isSubmitting}
                      onClick={() => moveImage(index, 1)}
                    >
                      {t("admin.moveImageDown")}
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "ms-auto rounded-lg border border-border px-2 py-1 text-xs text-red-700",
                        "hover:border-red-200 hover:bg-red-50",
                      )}
                      disabled={
                        isSubmitting ||
                        (Boolean(product) && imageUrls.length <= 1)
                      }
                      onClick={() => {
                        void removeImageAt(index);
                      }}
                    >
                      {t("admin.removeImage")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-secondary">
              {t("admin.noImagesYet")}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Field label={t("admin.imageUrl")} htmlFor="imageUrlDraft">
                <Input
                  id="imageUrlDraft"
                  value={urlDraft}
                  onChange={(event) => setUrlDraft(event.target.value)}
                  placeholder="/uploads/products/… or /products/…"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addImageUrlFromDraft();
                    }
                  }}
                />
              </Field>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              disabled={!urlDraft.trim() || isSubmitting}
              onClick={addImageUrlFromDraft}
            >
              {t("admin.addImageUrl")}
            </Button>
          </div>
        </FormSection>

        <FormSection
          title={t("admin.sectionCase")}
          description={t("admin.sectionCaseHint")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {CASE_SPEC_FIELDS.map((field) => (
              <Field key={field.key} label={t(field.labelKey)} htmlFor={`case-${field.key}`}>
                <Input
                  id={`case-${field.key}`}
                  value={details.case[field.key] ?? ""}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      case: {
                        ...current.case,
                        [field.key]: event.target.value,
                      },
                    }))
                  }
                />
              </Field>
            ))}
          </div>
        </FormSection>

        <FormSection
          title={t("admin.sectionMovement")}
          description={t("admin.sectionMovementHint")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {MOVEMENT_SPEC_FIELDS.map((field) => (
              <Field
                key={field.key}
                label={t(field.labelKey)}
                htmlFor={`movement-${field.key}`}
              >
                <Input
                  id={`movement-${field.key}`}
                  value={details.movement[field.key] ?? ""}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      movement: {
                        ...current.movement,
                        [field.key]: event.target.value,
                      },
                    }))
                  }
                />
              </Field>
            ))}
          </div>
        </FormSection>

        <FormSection
          title={t("admin.sectionHands")}
          description={t("admin.sectionHandsHint")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {HANDS_SPEC_FIELDS.map((field) => (
              <Field
                key={field.key}
                label={t(field.labelKey)}
                htmlFor={`hands-${field.key}`}
              >
                <Input
                  id={`hands-${field.key}`}
                  value={details.hands[field.key] ?? ""}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      hands: {
                        ...current.hands,
                        [field.key]: event.target.value,
                      },
                    }))
                  }
                />
              </Field>
            ))}
          </div>
        </FormSection>

        <FormSection
          title={t("admin.sectionServices")}
          description={t("admin.sectionServicesHint")}
        >
          <Field label={t("admin.care")} htmlFor="care">
            <textarea
              id="care"
              value={details.care}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  care: event.target.value,
                }))
              }
              className={textareaClassName}
              placeholder={t("admin.carePlaceholder")}
            />
          </Field>
          <Field label={t("admin.giftWrapping")} htmlFor="giftWrapping">
            <textarea
              id="giftWrapping"
              value={details.giftWrapping}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  giftWrapping: event.target.value,
                }))
              }
              className={textareaClassName}
              placeholder={t("admin.giftWrappingPlaceholder")}
            />
          </Field>
          <Field label={t("admin.shippingReturns")} htmlFor="shippingReturns">
            <textarea
              id="shippingReturns"
              value={details.shippingReturns}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  shippingReturns: event.target.value,
                }))
              }
              className={textareaClassName}
              placeholder={t("admin.shippingReturnsPlaceholder")}
            />
          </Field>
        </FormSection>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="accent"
          className="w-full sm:w-auto"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? t("admin.saving") : t("admin.saveProduct")}
        </Button>
      </form>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs text-secondary">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
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
