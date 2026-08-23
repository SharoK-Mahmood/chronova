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
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
