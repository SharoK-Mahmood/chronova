const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|webp|avif|gif)$/i;

const REMOTE_IMAGE_HOSTS = ["images.unsplash.com"];

export function hasProductPhoto(imageUrl: string): boolean {
  if (!imageUrl.trim()) {
    return false;
  }

  if (
    imageUrl.startsWith("/uploads/") ||
    IMAGE_EXTENSION_PATTERN.test(imageUrl)
  ) {
    return true;
  }

  try {
    const { hostname } = new URL(imageUrl, "http://localhost");
    return REMOTE_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export function getProductImageUrls(product: {
  imageUrl: string;
  imageUrls?: string[] | null;
}): string[] {
  if (product.imageUrls?.length) {
    return product.imageUrls.filter((url) => url.trim().length > 0);
  }

  return product.imageUrl.trim() ? [product.imageUrl] : [];
}
