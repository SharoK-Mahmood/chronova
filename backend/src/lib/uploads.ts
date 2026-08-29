import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root: backend/ */
export const BACKEND_ROOT = path.resolve(__dirname, "../..");

/** Single on-disk library for all product images (not in the database). */
export const PRODUCT_UPLOADS_DIR = path.join(
  BACKEND_ROOT,
  "uploads",
  "products",
);

/** Public URL path prefix served by Express static. */
export const PRODUCT_UPLOADS_URL_PREFIX = "/uploads/products";

export function ensureProductUploadsDir(): void {
  fs.mkdirSync(PRODUCT_UPLOADS_DIR, { recursive: true });
}

/** Folder name per watch model — use the product slug (e.g. tank-must, land-dweller-40). */
export function sanitizeModelSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Model slug is required");
  }

  return slug;
}

export function productModelDir(modelSlug: string): string {
  const model = sanitizeModelSlug(modelSlug);
  const dir = path.join(PRODUCT_UPLOADS_DIR, model);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function toProductImagePublicUrl(
  modelSlug: string,
  filename: string,
): string {
  return `${PRODUCT_UPLOADS_URL_PREFIX}/${sanitizeModelSlug(modelSlug)}/${filename}`;
}

export function toProductImagePublicUrlFromFile(file: {
  destination: string;
  filename: string;
}): string {
  const relative = path
    .relative(PRODUCT_UPLOADS_DIR, path.join(file.destination, file.filename))
    .split(path.sep)
    .join("/");

  return `${PRODUCT_UPLOADS_URL_PREFIX}/${relative}`;
}

/** True for URLs stored under this app's product uploads library. */
export function isLocalProductUploadUrl(publicUrl: string): boolean {
  return publicUrl.startsWith(`${PRODUCT_UPLOADS_URL_PREFIX}/`);
}

/**
 * Resolve a public `/uploads/products/...` URL to an absolute path,
 * or null if the URL is external / unsafe (path traversal).
 */
export function resolveProductUploadPath(publicUrl: string): string | null {
  if (!isLocalProductUploadUrl(publicUrl)) {
    return null;
  }

  const relativeUrl = publicUrl
    .slice(PRODUCT_UPLOADS_URL_PREFIX.length + 1)
    .replace(/\\/g, "/");

  if (
    !relativeUrl ||
    relativeUrl.includes("..") ||
    path.isAbsolute(relativeUrl)
  ) {
    return null;
  }

  const resolved = path.resolve(PRODUCT_UPLOADS_DIR, relativeUrl);
  const relativeToRoot = path.relative(PRODUCT_UPLOADS_DIR, resolved);

  if (
    !relativeToRoot ||
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    return null;
  }

  return resolved;
}

/** Deletes a local product image file. Returns true if a file was removed. */
export function deleteProductUploadFile(publicUrl: string): boolean {
  const filePath = resolveProductUploadPath(publicUrl);
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  fs.unlinkSync(filePath);
  return true;
}

/** Deletes any local upload files in `urls` that are no longer referenced. */
export function deleteRemovedProductUploadFiles(
  previousUrls: string[],
  nextUrls: string[],
): void {
  const kept = new Set(nextUrls);
  for (const url of previousUrls) {
    if (!kept.has(url) && isLocalProductUploadUrl(url)) {
      deleteProductUploadFile(url);
    }
  }
}

/**
 * Removes the entire `uploads/products/{slug}/` folder for a product model.
 * Safe against path traversal; no-op if the folder does not exist.
 */
export function deleteProductModelDir(modelSlug: string): boolean {
  let model: string;
  try {
    model = sanitizeModelSlug(modelSlug);
  } catch {
    return false;
  }

  const dir = path.join(PRODUCT_UPLOADS_DIR, model);
  const relativeToRoot = path.relative(PRODUCT_UPLOADS_DIR, dir);

  if (
    !relativeToRoot ||
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot) ||
    relativeToRoot.includes(path.sep)
  ) {
    return false;
  }

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return false;
  }

  fs.rmSync(dir, { recursive: true, force: true });
  return true;
}
