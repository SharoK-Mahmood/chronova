import { BrandCard } from "@/features/brands/components/BrandCard";
import type { BrandSummary } from "@/features/brands/types/brand.types";
import { cn } from "@/shared/lib/utils/cn";

type BrandGridProps = {
  brands: BrandSummary[];
  className?: string;
};

export function BrandGrid({ brands, className }: BrandGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {brands.map((brand) => (
        <BrandCard key={brand.slug} brand={brand} />
      ))}
    </div>
  );
}
