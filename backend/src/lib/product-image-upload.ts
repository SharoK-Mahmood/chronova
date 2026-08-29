import fs from "node:fs";
import path from "node:path";

import multer from "multer";
import type { RequestHandler, Request } from "express";

import { badRequest } from "./http-error.js";
import {
  ensureProductUploadsDir,
  productModelDir,
  sanitizeModelSlug,
} from "./uploads.js";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 20;

ensureProductUploadsDir();

function readModelFromRequest(req: Request): string {
  // Prefer query string — multipart body fields are not always available
  // when multer chooses the destination folder.
  const fromQuery =
    typeof req.query?.model === "string" ? req.query.model : undefined;
  const fromBody =
    typeof req.body?.model === "string" ? req.body.model : undefined;

  try {
    return sanitizeModelSlug(fromQuery || fromBody || "");
  } catch {
    throw badRequest(
      "A product model slug is required (use the product slug, e.g. tank-must)",
      "MODEL_REQUIRED",
    );
  }
}

/** Indexes already used by `{slug}.ext` / `{slug}-2.ext` in a model folder. */
function usedSlugIndexes(modelDir: string, modelSlug: string): Set<number> {
  const used = new Set<number>();
  const escaped = modelSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}(?:-(\\d+))?\\.[^.]+$`, "i");

  for (const name of fs.readdirSync(modelDir)) {
    const match = name.match(pattern);
    if (!match) {
      continue;
    }
    used.add(match[1] ? Number(match[1]) : 1);
  }

  return used;
}

/** Next filename like `tank-must.avif`, then `tank-must-2.avif`, … */
function nextSlugFilename(
  req: Request,
  modelDir: string,
  modelSlug: string,
  extension: string,
): string {
  const reservedKey = "__productImageNames" as const;
  const reserved =
    ((req as Request & { [reservedKey]?: Set<string> })[reservedKey] ??=
      new Set<string>());

  const used = usedSlugIndexes(modelDir, modelSlug);

  for (const name of reserved) {
    const escaped = modelSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = name.match(
      new RegExp(`^${escaped}(?:-(\\d+))?\\.[^.]+$`, "i"),
    );
    if (match) {
      used.add(match[1] ? Number(match[1]) : 1);
    }
  }

  let filename: string;
  if (!used.has(1)) {
    filename = `${modelSlug}${extension}`;
  } else {
    let index = 2;
    while (used.has(index)) {
      index += 1;
    }
    filename = `${modelSlug}-${index}${extension}`;
  }

  reserved.add(filename.toLowerCase());
  return filename;
}

const storage = multer.diskStorage({
  destination: (req, _file, callback) => {
    try {
      const model = readModelFromRequest(req);
      callback(null, productModelDir(model));
    } catch (error) {
      callback(error as Error, "");
    }
  },
  filename: (req, file, callback) => {
    try {
      const model = readModelFromRequest(req);
      const modelDir = productModelDir(model);
      const fromMime = EXTENSION_BY_MIME[file.mimetype];
      const fromName = path.extname(file.originalname).toLowerCase();
      const extension = fromMime || fromName || ".jpg";

      callback(null, nextSlugFilename(req, modelDir, model, extension));
    } catch (error) {
      callback(error as Error, "");
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES_PER_REQUEST },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(
        badRequest(
          "Only JPEG, PNG, WebP, or AVIF images are allowed",
          "INVALID_IMAGE_TYPE",
        ),
      );
      return;
    }

    callback(null, true);
  },
});

export const productImageUpload: RequestHandler = upload.single("image");
export const productImagesUpload: RequestHandler = upload.array(
  "images",
  MAX_FILES_PER_REQUEST,
);

export { toProductImagePublicUrlFromFile as toProductImagePublicUrl } from "./uploads.js";
