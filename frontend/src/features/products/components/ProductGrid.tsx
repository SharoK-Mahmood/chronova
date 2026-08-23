import type { ProductSummary } from "@/features/products/types/product.types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { cn } from "@/shared/lib/utils/cn";

type ProductGridProps = {
  products: ProductSummary[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:gap-6",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
