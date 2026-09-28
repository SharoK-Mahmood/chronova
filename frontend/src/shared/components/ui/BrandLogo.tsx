"use client";

import Image from "next/image";

import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type BrandLogoProps = {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Theme-aware Chronova wordmark:
 * - light UI → navy wordmark (`chronova-logo-light.png`)
 * - dark UI → cream wordmark (`chronova-logo-dark.png`)
 */
export function BrandLogo({
  width = 220,
  height = 60,
  className,
  priority = false,
}: BrandLogoProps) {
  const { t } = useTranslation();

  return (
    <span className={cn("relative inline-flex", className)}>
      <Image
        src="/chronova-logo-light.png"
        alt={t("site.name")}
        width={width}
        height={height}
        priority={priority}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src="/chronova-logo-dark.png"
        alt=""
        aria-hidden
        width={width}
        height={height}
        priority={priority}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
