import Image from "next/image";
import Link from "next/link";

import type { BrandSummary } from "@/features/brands/types/brand.types";
import { cn } from "@/shared/lib/utils/cn";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";

type BrandCardProps = {
  brand: BrandSummary;
  className?: string;
};

export function BrandCard({ brand, className }: BrandCardProps) {
  const hasImage = brand.imageUrl && hasProductPhoto(brand.imageUrl);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/brands/${brand.slug}`} className="flex flex-1 flex-col">
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center p-8",
            hasImage ? "bg-white" : "bg-background",
          )}
        >
          {hasImage ? (
            <Image
              src={brand.imageUrl!}
              alt={`${brand.name} watch`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-6 transition-transform group-hover:scale-105"
            />
          ) : (
            <p className="text-center text-2xl font-semibold tracking-tight text-primary/80">
              {brand.name}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs uppercase tracking-widest text-accent">
            {brand.origin}
          </p>
          <h3 className="text-lg font-medium group-hover:underline">
            {brand.name}
          </h3>
          <p className="line-clamp-2 text-sm text-secondary">
            {brand.description}
          </p>
          <p className="mt-2 text-sm text-secondary">
            {brand.productCount > 0
              ? `${brand.productCount} ${brand.productCount === 1 ? "watch" : "watches"} available`
              : "Coming soon"}
          </p>
        </div>
      </Link>
    </article>
  );
}
