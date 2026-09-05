"use client";

import Image, { type ImageProps } from "next/image";

import { shouldUnoptimizeMedia } from "@/shared/lib/utils/product-image";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** next/image wrapper that allows absolute API/tunnel upload URLs. */
export function ProductImage({ src, unoptimized, ...props }: ProductImageProps) {
  return (
    <Image
      src={src}
      unoptimized={unoptimized ?? shouldUnoptimizeMedia(src)}
      {...props}
    />
  );
}
