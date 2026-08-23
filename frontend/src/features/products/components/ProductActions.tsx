"use client";

import { AddToCartButton } from "@/features/cart";
import { WishlistButton } from "@/features/wishlist";
import { Button } from "@/shared/components/ui/Button";
import { useTranslation } from "@/shared/i18n";

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
  const { t } = useTranslation();

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
        {t("products.backToShop")}
      </Button>
    </div>
  );
}
