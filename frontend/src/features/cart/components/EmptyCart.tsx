"use client";

import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

export function EmptyCart() {
  const { t } = useTranslation();

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-16 text-center sm:py-20">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            {t("cart.yourSelection")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("cart.shoppingBag")}
          </h1>
        </Container>
      </section>
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
            <path d="M6 6h15l-1.5 9h-12L6 6z" />
            <path d="M6 6L5 3H2" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("cart.empty")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-secondary">
          {t("cart.emptyDesc")}
        </p>
        <div className="mt-8">
          <Button href="/products" variant="accent">
            {t("cart.exploreCollection")}
          </Button>
        </div>
      </Container>
    </>
  );
}
