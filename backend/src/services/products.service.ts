import { Prisma } from "@prisma/client";
import { z } from "zod";

import { badRequest, conflict, notFound } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";

const productWriteSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  description: z.string().trim().min(1),
  price: z.number().positive(),
  currency: z.string().trim().min(1).default("USD"),
  imageUrl: z.string().trim().min(1),
  category: z.string().trim().min(1),
  inStock: z.boolean().default(true),
  brand: z.string().trim().min(1),
  reference: z.string().trim().min(1).optional().nullable(),
  subtitle: z.string().trim().min(1).optional().nullable(),
});

const productPatchSchema = productWriteSchema.partial();

export type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  brand: string;
  reference?: string;
  subtitle?: string;
};

function toProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  brand: string;
  reference: string | null;
  subtitle: string | null;
}): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
    category: product.category,
    inStock: product.inStock,
    brand: product.brand,
    ...(product.reference ? { reference: product.reference } : {}),
    ...(product.subtitle ? { subtitle: product.subtitle } : {}),
  };
}

export async function listProducts(query: {
  category?: string;
  brand?: string;
}) {
  const products = await prisma.product.findMany({
    where: query.category ? { category: query.category } : undefined,
    orderBy: { name: "asc" },
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

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        reference: data.reference ?? null,
        subtitle: data.subtitle ?? null,
      },
    });

    return toProduct(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
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

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.reference !== undefined ? { reference: data.reference ?? null } : {}),
        ...(data.subtitle !== undefined ? { subtitle: data.subtitle ?? null } : {}),
      },
    });

    return toProduct(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw notFound("Product");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict("A product with this slug already exists", "SLUG_IN_USE");
    }

    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw notFound("Product");
    }

    throw error;
  }
}
