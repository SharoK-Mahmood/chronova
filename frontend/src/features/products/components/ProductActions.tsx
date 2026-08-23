"use client";

import { WishlistButton } from "@/features/wishlist";
import { Button } from "@/shared/components/ui/Button";

type ProductActionsProps = {
  slug: string;
  name: string;
};

export function ProductActions({ slug, name }: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button type="button" className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
        Add to cart
      </Button>
      <WishlistButton slug={slug} productName={name} variant="button" />
      <Button
        href="/products"
        variant="secondary"
        className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      >
        Back to shop
      </Button>
    </div>
  );
}
