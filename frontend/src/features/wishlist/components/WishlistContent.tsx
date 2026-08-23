"use client";

import { useMemo } from "react";

import { getProductBySlug } from "@/features/products/data/mock-products";
import type { ProductSummary } from "@/features/products/types/product.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { EmptyWishlist } from "@/features/wishlist/components/EmptyWishlist";
import { WishlistItemCard } from "@/features/wishlist/components/WishlistItemCard";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

function toSummary(product: NonNullable<ReturnType<typeof getProductBySlug>>): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
    brand: product.brand,
    reference: product.reference,
    subtitle: product.subtitle,
  };
}

export function WishlistContent() {
  const { t } = useTranslation();
  const { slugs, isHydrated, count } = useWishlist();

  const products = useMemo(() => {
    return slugs
      .map((slug) => getProductBySlug(slug))
      .filter((product): product is NonNullable<typeof product> => product !== undefined)
      .map(toSummary);
  }, [slugs]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">{t("wishlist.loading")}</p>
      </Container>
    );
  }

  if (count === 0) {
    return <EmptyWishlist />;
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("wishlist.title")}</h1>
          <p className="mt-2 text-secondary">
            {count === 1
              ? t("wishlist.savedOne")
              : t("wishlist.saved", { count })}
          </p>
        </div>
        <Button href="/products" variant="secondary">
          {t("common.continueShopping")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <WishlistItemCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
