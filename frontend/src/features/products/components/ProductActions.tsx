"use client";

import { AddToCartButton } from "@/features/cart";
import { WishlistButton } from "@/features/wishlist";
import { Button } from "@/shared/components/ui/Button";

type ProductActionsProps = {
  slug: string;
  name: string;
  unitPriceUsd?: number;
};

export function ProductActions({
  slug,
  name,
  unitPriceUsd,
}: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <AddToCartButton
        slug={slug}
        productName={name}
        unitPriceUsd={unitPriceUsd}
        variant="button"
      />
      <WishlistButton slug={slug} productName={name} variant="button" />
      <Button href="/products" variant="secondary">
        Back to shop
      </Button>
    </div>
  );
}
