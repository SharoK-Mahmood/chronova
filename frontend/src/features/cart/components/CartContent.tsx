"use client";

import { useMemo } from "react";

import { CartLineRow } from "@/features/cart/components/CartLineRow";
import { EmptyCart } from "@/features/cart/components/EmptyCart";
import { useCart } from "@/features/cart/context/CartProvider";
import { Price, useCurrency } from "@/features/currency";
import { getProductBySlug } from "@/features/products/data/mock-products";
import { Button } from "@/shared/components/ui/Button";
import { textLinkButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { Container } from "@/shared/components/ui/Container";

export function CartContent() {
  const { entries, isHydrated, itemCount, clearCart } = useCart();
  const { currency } = useCurrency();

  const subtotalUsd = useMemo(() => {
    return entries.reduce((total, entry) => {
      const product = getProductBySlug(entry.slug);
      if (!product) return total;
      const unitPrice = entry.unitPriceUsd ?? product.price;
      return total + unitPrice * entry.quantity;
    }, 0);
  }, [entries]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">Loading your bag...</p>
      </Container>
    );
  }

  if (itemCount === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <section className="border-b border-border bg-primary text-background">
        <Container className="py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            Your Selection
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Shopping Bag
          </h1>
          <p className="mt-3 max-w-xl text-background/70">
            Review each timepiece below — your curated selection is ready when
            you are.
          </p>
          <p className="mt-4 text-sm text-background/50">
            {itemCount} {itemCount === 1 ? "piece" : "pieces"} in your bag
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={clearCart}
            className={cn("text-sm text-secondary", textLinkButtonClasses)}
          >
            Clear bag
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              Items in your bag
            </p>
            <div className="divide-y divide-border rounded-2xl border border-border bg-card">
              {entries.map((entry) => (
                <div key={entry.slug} className="px-4 sm:px-6">
                  <CartLineRow entry={entry} />
                </div>
              ))}
            </div>
          </div>

          <aside className="sticky top-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">
              Order summary
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Confirm your selection before completing purchase.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Subtotal</dt>
                <dd className="font-medium">
                  <Price amountUsd={subtotalUsd} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Shipping</dt>
                <dd className="text-secondary">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold">Estimated total</dt>
                <dd className="font-semibold text-accent">
                  <Price amountUsd={subtotalUsd} />
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-secondary">
              Prices shown in{" "}
              {currency === "USD" ? "US Dollars" : "Iraqi Dinar"}.
            </p>
            <Button
              href="/checkout"
              variant="accent"
              className="mt-6 w-full"
            >
              Complete purchase
            </Button>
            <Button href="/products" variant="secondary" className="mt-3 w-full">
              Continue shopping
            </Button>
          </aside>
        </div>
      </Container>
    </>
  );
}
