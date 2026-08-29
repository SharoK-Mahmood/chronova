import { Prisma } from "@prisma/client";
import { z } from "zod";

import { badRequest, conflict, notFound } from "../lib/http-error.js";
import {
  hasAnyProductDetails,
  normalizeProductDetails,
  parseProductDetails,
  serializeProductDetails,
} from "../lib/product-details.js";
import { prisma } from "../lib/prisma.js";
import {
  deleteProductModelDir,
  deleteProductUploadFile,
  deleteRemovedProductUploadFiles,
  isLocalProductUploadUrl,
} from "../lib/uploads.js";
import type { ProductDetails } from "../types/product-details.js";

const imageUrlSchema = z.string().trim().min(1);
const categorySchema = z.enum(["men", "women", "unisex"]);
const optionalText = z.string().trim().optional().nullable();

const specsRecordSchema = z.record(z.string(), z.string()).optional();

const detailsSchema = z
  .object({
    case: specsRecordSchema,
    movement: specsRecordSchema,
    hands: specsRecordSchema,
    care: z.string().optional(),
    giftWrapping: z.string().optional(),
    shippingReturns: z.string().optional(),
  })
  .optional();

const productWriteSchema = z
  .object({
    name: z.string().trim().min(1),
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
    description: z.string().trim().min(1),
    price: z.number().positive(),
    currency: z.string().trim().min(1).default("USD"),
    imageUrl: imageUrlSchema.optional(),
    imageUrls: z.array(imageUrlSchema).min(1).optional(),
    category: categorySchema,
    inStock: z.boolean().default(true),
    brand: z.string().trim().min(1),
    reference: optionalText,
    subtitle: optionalText,
    details: detailsSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.imageUrls?.length && !data.imageUrl) {
      ctx.addIssue({
        code: "custom",
        message: "At least one product image is required",
        path: ["imageUrls"],
      });
    }
  });

const productPatchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .optional(),
  description: z.string().trim().min(1).optional(),
  price: z.number().positive().optional(),
  currency: z.string().trim().min(1).optional(),
  imageUrl: imageUrlSchema.optional(),
  imageUrls: z.array(imageUrlSchema).min(1).optional(),
  category: categorySchema.optional(),
  inStock: z.boolean().optional(),
  brand: z.string().trim().min(1).optional(),
  reference: optionalText,
  subtitle: optionalText,
  details: detailsSchema,
});

export type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageUrls: string[];
  category: "men" | "women" | "unisex";
  inStock: boolean;
  brand: string;
  reference?: string;
  subtitle?: string;
  details: ProductDetails;
  createdAt: string;
};

function parseImageUrls(raw: string | null | undefined, fallback: string): string[] {
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const urls = parsed.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        );
        if (urls.length > 0) {
          return urls;
        }
      }
    } catch {
      // Fall through to primary imageUrl.
    }
  }

  return fallback ? [fallback] : [];
}

function normalizeImageUrls(input: {
  imageUrl?: string;
  imageUrls?: string[];
}): { imageUrl: string; imageUrls: string[]; imageUrlsJson: string } {
  const urls = (input.imageUrls?.length
    ? input.imageUrls
    : input.imageUrl
      ? [input.imageUrl]
      : []
  )
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    throw badRequest("At least one product image is required", "IMAGES_REQUIRED");
  }

  return {
    imageUrl: urls[0],
    imageUrls: urls,
    imageUrlsJson: JSON.stringify(urls),
  };
}

function normalizeCategory(value: string): "men" | "women" | "unisex" {
  if (value === "women") {
    return "women";
  }
  if (value === "unisex") {
    return "unisex";
  }
  return "men";
}

function toProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageUrlsJson: string;
  category: string;
  inStock: boolean;
  brand: string;
  reference: string | null;
  subtitle: string | null;
  detailsJson: string;
  createdAt: Date;
}): ProductResponse {
  const imageUrls = parseImageUrls(product.imageUrlsJson, product.imageUrl);
  const details = parseProductDetails(product.detailsJson);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    currency: product.currency,
    imageUrl: imageUrls[0] ?? product.imageUrl,
    imageUrls,
    category: normalizeCategory(product.category),
    inStock: product.inStock,
    brand: product.brand,
    ...(product.reference ? { reference: product.reference } : {}),
    ...(product.subtitle ? { subtitle: product.subtitle } : {}),
    details,
    createdAt: product.createdAt.toISOString(),
  };
}

export async function listProducts(query: {
  category?: string;
  brand?: string;
}) {
  const categoryFilter =
    query.category === "men" || query.category === "women"
      ? { OR: [{ category: query.category }, { category: "unisex" }] }
      : query.category
        ? { category: query.category }
        : undefined;

  const products = await prisma.product.findMany({
    where: categoryFilter,
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });

  const filtered = query.brand
    ? products.filter(
        (product) => product.brand.toLowerCase() === query.brand!.toLowerCase(),
      )
    : products;

  return filtered.map(toProduct);
}

export async function getProduct(idOrSlug: string) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!product) {
    throw notFound("Product");
  }

  return toProduct(product);
}

export async function createProduct(input: unknown) {
  const data = productWriteSchema.parse(input);
  const images = normalizeImageUrls(data);
  const details = normalizeProductDetails(data.details);

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        currency: data.currency,
        imageUrl: images.imageUrl,
        imageUrlsJson: images.imageUrlsJson,
        category: data.category,
        inStock: data.inStock,
        brand: data.brand,
        reference: data.reference ?? null,
        subtitle: data.subtitle ?? null,
        detailsJson: serializeProductDetails(details),
      },
    });

    return toProduct(product);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw conflict("A product with this slug already exists", "SLUG_IN_USE");
    }

    throw error;
  }
}

export async function updateProduct(id: string, input: unknown) {
  const data = productPatchSchema.parse(input);

  if (Object.keys(data).length === 0) {
    throw badRequest("No fields to update");
  }

  const images =
    data.imageUrls !== undefined || data.imageUrl !== undefined
      ? normalizeImageUrls({
          imageUrl: data.imageUrl,
          imageUrls: data.imageUrls,
        })
      : null;

  const details =
    data.details !== undefined
      ? normalizeProductDetails(data.details)
      : null;

  try {
    const existing = images
      ? await prisma.product.findUnique({ where: { id } })
      : null;

    if (images && !existing) {
      throw notFound("Product");
    }

    const previousUrls = existing
      ? parseImageUrls(existing.imageUrlsJson, existing.imageUrl)
      : [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.inStock !== undefined ? { inStock: data.inStock } : {}),
        ...(data.brand !== undefined ? { brand: data.brand } : {}),
        ...(data.reference !== undefined
          ? { reference: data.reference ?? null }
          : {}),
        ...(data.subtitle !== undefined
          ? { subtitle: data.subtitle ?? null }
          : {}),
        ...(images
          ? {
              imageUrl: images.imageUrl,
              imageUrlsJson: images.imageUrlsJson,
            }
          : {}),
        ...(details
          ? { detailsJson: serializeProductDetails(details) }
          : {}),
      },
    });

    if (images) {
      deleteRemovedProductUploadFiles(previousUrls, images.imageUrls);
    }

    return toProduct(product);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw notFound("Product");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw conflict("A product with this slug already exists", "SLUG_IN_USE");
    }

    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw notFound("Product");
    }

    const urls = parseImageUrls(existing.imageUrlsJson, existing.imageUrl);
    const slug = existing.slug;

    await prisma.product.delete({ where: { id } });

    // Remove the whole model folder (all images for this product).
    deleteProductModelDir(slug);

    // Also remove any local uploads referenced outside that folder.
    for (const url of urls) {
      if (isLocalProductUploadUrl(url)) {
        deleteProductUploadFile(url);
      }
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw notFound("Product");
    }

    throw error;
  }
}

export { hasAnyProductDetails };
