import { apiClient } from "@/shared/lib/api/client";

export type ProductImageUploadResult = {
  imageUrl: string;
  imageUrls: string[];
  model?: string | null;
  storage: "filesystem";
};

export type ProductImagesUploadResult = {
  imageUrls: string[];
  model?: string | null;
  storage: "filesystem";
};

function assertModelSlug(modelSlug: string): string {
  const model = modelSlug.trim();
  if (!model) {
    throw new Error("Product slug is required before uploading images");
  }
  return model;
}

/** Uploads one image into uploads/products/{model}/. DB only stores the returned URL. */
export async function uploadProductImage(
  file: File,
  modelSlug: string,
): Promise<ProductImageUploadResult> {
  const model = assertModelSlug(modelSlug);
  const body = new FormData();
  body.append("image", file);

  // Model must be a query param — multer cannot reliably read multipart fields
  // when deciding the upload destination folder.
  return apiClient<ProductImageUploadResult>(
    `/uploads/products?model=${encodeURIComponent(model)}`,
    {
      method: "POST",
      body,
    },
  );
}

/** Uploads multiple images into uploads/products/{model}/. */
export async function uploadProductImages(
  files: File[],
  modelSlug: string,
): Promise<ProductImagesUploadResult> {
  const model = assertModelSlug(modelSlug);
  const body = new FormData();
  for (const file of files) {
    body.append("images", file);
  }

  return apiClient<ProductImagesUploadResult>(
    `/uploads/products/batch?model=${encodeURIComponent(model)}`,
    {
      method: "POST",
      body,
    },
  );
}

/** Deletes a local upload file from disk (`/uploads/products/...`). */
export async function deleteProductImage(
  imageUrl: string,
): Promise<{ imageUrl: string; deleted: boolean }> {
  return apiClient<{ imageUrl: string; deleted: boolean; storage: string }>(
    "/uploads/products",
    {
      method: "DELETE",
      body: { imageUrl },
    },
  );
}
