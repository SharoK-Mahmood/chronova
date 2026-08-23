import Link from "next/link";

import type { ProductSummary } from "@/features/products/types/product.types";
import { cn } from "@/shared/lib/utils/cn";

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="flex aspect-square items-center justify-center bg-foreground/[0.03] p-8">
          <div className="h-24 w-24 rounded-full border border-foreground/10 bg-background shadow-sm" />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-medium group-hover:underline">{product.name}</h3>
          <p className="text-sm text-foreground/60">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
