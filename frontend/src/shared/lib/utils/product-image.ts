const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|webp|avif)$/i;

const REMOTE_IMAGE_HOSTS = ["images.unsplash.com"];

export function hasProductPhoto(imageUrl: string): boolean {
  if (IMAGE_EXTENSION_PATTERN.test(imageUrl)) {
    return true;
  }

  try {
    const { hostname } = new URL(imageUrl, "http://localhost");
    return REMOTE_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
