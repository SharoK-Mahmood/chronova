import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../lib/async-handler.js";
import {
  productImageUpload,
  productImagesUpload,
  toProductImagePublicUrl,
} from "../lib/product-image-upload.js";
import { badRequest } from "../lib/http-error.js";
import {
  deleteProductUploadFile,
  isLocalProductUploadUrl,
} from "../lib/uploads.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const uploadsRouter = Router();

uploadsRouter.post(
  "/products",
  requireAuth,
  requireAdmin,
  productImageUpload,
  asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
      throw badRequest("Image file is required", "IMAGE_REQUIRED");
    }

    const imageUrl = toProductImagePublicUrl(file);

    res.status(201).json({
      imageUrl,
      imageUrls: [imageUrl],
      model: req.body?.model ?? null,
      storage: "filesystem",
    });
  }),
);

uploadsRouter.post(
  "/products/batch",
  requireAuth,
  requireAdmin,
  productImagesUpload,
  asyncHandler(async (req, res) => {
    const files = req.files;

    if (!Array.isArray(files) || files.length === 0) {
      throw badRequest("At least one image file is required", "IMAGE_REQUIRED");
    }

    const imageUrls = files.map((file) => toProductImagePublicUrl(file));

    res.status(201).json({
      imageUrls,
      model: req.body?.model ?? null,
      storage: "filesystem",
    });
  }),
);

const deleteImageBodySchema = z.object({
  imageUrl: z.string().min(1),
});

uploadsRouter.delete(
  "/products",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { imageUrl } = deleteImageBodySchema.parse(req.body);

    if (!isLocalProductUploadUrl(imageUrl)) {
      throw badRequest(
        "Only local product upload URLs can be deleted from disk",
        "NOT_LOCAL_UPLOAD",
      );
    }

    const deleted = deleteProductUploadFile(imageUrl);

    res.json({
      imageUrl,
      deleted,
      storage: "filesystem",
    });
  }),
);
