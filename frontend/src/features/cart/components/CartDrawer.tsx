"use client";

import Link from "next/link";
import { useMemo } from "react";

import { CartDrawerItem } from "@/features/cart/components/CartDrawerItem";
import { useCart } from "@/features/cart/context/CartProvider";
import { Price, useCurrency } from "@/features/currency";
import { getProductBySlug } from "@/features/products/data/mock-products";
import { Button } from "@/shared/components/ui/Button";
import { interactiveIconButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";

export function CartDrawer() {
  const { entries, itemCount, isHydrated, isDrawerOpen, closeDrawer } =
    useCart();
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
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-300",
        isDrawerOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isDrawerOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="border-b border-border bg-primary px-6 py-6 text-background">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                Your Selection
              </p>
              <h2
                id="cart-drawer-title"
                className="mt-2 text-2xl font-semibold tracking-tight"
              >
                Shopping Bag
              </h2>
              <p className="mt-1 text-sm text-background/70">
                {itemCount > 0
                  ? `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} reserved for you`
                  : "Your bag is awaiting its first timepiece"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close shopping bag"
              className={cn(
                "rounded-full p-2 text-background/70",
                interactiveIconButtonClasses,
                "hover:bg-background/10 hover:text-background",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </header>

        {itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
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
            <p className="text-lg font-medium">Nothing in your bag yet</p>
            <p className="mt-2 max-w-xs text-sm text-secondary">
              Discover exceptional watches and add your favourites — they&apos;ll
              appear here for your review.
            </p>
            <Button href="/products" variant="accent" onClick={closeDrawer} className="mt-8">
              Explore collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                In your bag
              </p>
              {entries.map((entry) => (
                <CartDrawerItem
                  key={entry.slug}
                  entry={entry}
                  onNavigate={closeDrawer}
                />
              ))}
            </div>

            <footer className="relative border-t border-border bg-card px-6 py-6">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-secondary">Subtotal</dt>
                  <dd className="font-medium">
                    <Price amountUsd={subtotalUsd} />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-secondary">Shipping</dt>
                  <dd className="text-secondary">At checkout</dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Estimated total</dt>
                  <dd className="font-semibold text-accent">
                    <Price amountUsd={subtotalUsd} />
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] text-secondary">
                Displayed in{" "}
                {currency === "USD" ? "US Dollars" : "Iraqi Dinar"}.
              </p>

              <div className="mt-6 space-y-3">
                <Button
                  href="/checkout"
                  variant="accent"
                  onClick={closeDrawer}
                  className="w-full"
                >
                  Complete purchase
                </Button>
                <Button
                  href="/products"
                  variant="secondary"
                  onClick={closeDrawer}
                  className="w-full"
                >
                  Continue shopping
                </Button>
              </div>

              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-4 block text-center text-xs font-medium text-accent transition-colors hover:text-accent/80"
              >
                View full bag details
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
