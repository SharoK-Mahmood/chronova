"use client";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function EmptyWishlist() {
  const { t } = useTranslation();

  return (
    <Container className="py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8 text-accent"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.5l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 0 1 6.5 3c1.74 0 3.41.81 4.5 2.09A6.32 6.32 0 0 1 15.5 3 4.5 4.5 0 0 1 20 7.5c0 3.78-3.4 6.86-8.55 11.68L12 20.5z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t("wishlist.empty")}
      </h1>
      <p className="mt-3 text-secondary">
        {t("wishlist.emptyDesc")}
      </p>
      <div className="mt-8">
        <Button href="/products">{t("common.browseWatches")}</Button>
      </div>
    </Container>
  );
}
