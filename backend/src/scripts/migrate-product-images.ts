/**
 * Migrates product images into one library:
 *   backend/uploads/products/{model-slug}/filename.ext
 *
 * - Copies legacy frontend/public/products files into model folders
 * - Moves flat UUID uploads into the product folder that references them
 * - Rewrites DB imageUrl / imageUrlsJson paths when files move
 *
 * Run: npx tsx src/scripts/migrate-product-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prisma } from "../lib/prisma.js";
import {
  PRODUCT_UPLOADS_DIR,
  PRODUCT_UPLOADS_URL_PREFIX,
  ensureProductUploadsDir,
  productModelDir,
  sanitizeModelSlug,
} from "../lib/uploads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_PRODUCTS_DIR = path.resolve(
  BACKEND_ROOT,
  "../frontend/public/products",
);

function parseUrls(raw: string | null | undefined, fallback: string): string[] {
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
      // ignore
    }
  }

  return fallback ? [fallback] : [];
}

function copyIfNeeded(source: string, destination: string) {
  if (!fs.existsSync(source)) {
    return false;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (!fs.existsSync(destination)) {
    fs.copyFileSync(source, destination);
  }
  return true;
}

async function migrate() {
  ensureProductUploadsDir();

  const localSeedModels = [
    "land-dweller-40",
    "day-date-40",
    "sky-dweller",
  ] as const;

  for (const model of localSeedModels) {
    const source = path.join(PUBLIC_PRODUCTS_DIR, `${model}.png`);
    const destination = path.join(productModelDir(model), `${model}.png`);
    if (copyIfNeeded(source, destination)) {
      console.log(`Copied seed image → ${model}/${model}.png`);
    }
  }

  const products = await prisma.product.findMany();

  for (const product of products) {
    const model = sanitizeModelSlug(product.slug);
    const urls = parseUrls(product.imageUrlsJson, product.imageUrl);
    let changed = false;
    const nextUrls: string[] = [];

    for (const url of urls) {
      // Legacy Next public path → uploads library
      const publicMatch = url.match(/^\/products\/([^/?#]+)$/);
      if (publicMatch) {
        const filename = publicMatch[1];
        const source = path.join(PUBLIC_PRODUCTS_DIR, filename);
        const destination = path.join(productModelDir(model), filename);
        copyIfNeeded(source, destination);
        const next = `${PRODUCT_UPLOADS_URL_PREFIX}/${model}/${filename}`;
        nextUrls.push(next);
        changed = true;
        continue;
      }

      // Flat uploads/products/{uuid}.ext → uploads/products/{model}/{uuid}.ext
      const flatMatch = url.match(/^\/uploads\/products\/([^/]+)$/);
      if (flatMatch) {
        const filename = flatMatch[1];
        const source = path.join(PRODUCT_UPLOADS_DIR, filename);
        const destination = path.join(productModelDir(model), filename);
        if (fs.existsSync(source)) {
          fs.mkdirSync(path.dirname(destination), { recursive: true });
          if (!fs.existsSync(destination)) {
            fs.renameSync(source, destination);
          } else {
            fs.unlinkSync(source);
          }
          console.log(`Moved flat upload → ${model}/${filename}`);
        }
        const next = `${PRODUCT_UPLOADS_URL_PREFIX}/${model}/${filename}`;
        nextUrls.push(next);
        changed = true;
        continue;
      }

      nextUrls.push(url);
    }

    if (changed && nextUrls.length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          imageUrl: nextUrls[0],
          imageUrlsJson: JSON.stringify(nextUrls),
        },
      });
      console.log(`Updated DB paths for ${product.slug}`);
    }
  }

  // Any leftover flat files go to unsorted/ (ignore docs/keep files)
  const leftovers = fs
    .readdirSync(PRODUCT_UPLOADS_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name !== ".gitkeep" &&
        entry.name !== "README.md",
    );

  if (leftovers.length > 0) {
    const unsorted = productModelDir("unsorted");
    for (const entry of leftovers) {
      const source = path.join(PRODUCT_UPLOADS_DIR, entry.name);
      const destination = path.join(unsorted, entry.name);
      if (!fs.existsSync(destination)) {
        fs.renameSync(source, destination);
      }
      console.log(`Archived leftover → unsorted/${entry.name}`);
    }
  }

  console.log("Product image migration complete.");
  console.log(`Library root: ${PRODUCT_UPLOADS_DIR}`);
}

migrate()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
