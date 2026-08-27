"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

import { CartDrawerItem } from "@/features/cart/components/CartDrawerItem";
import { useCart } from "@/features/cart/context/CartProvider";
import { Price, useCurrency } from "@/features/currency";
import { useProductCatalog } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { interactiveIconButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { useTranslation } from "@/shared/i18n";

export function CartDrawer() {
  const { t } = useTranslation();
  const { entries, itemCount, isHydrated, isDrawerOpen, closeDrawer } =
    useCart();
  const { currency } = useCurrency();
  const { getProductBySlug } = useProductCatalog();
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currencyLabel =
    currency === "USD" ? t("common.usd") : t("common.iqd");

  const subtotalUsd = useMemo(() => {
    return entries.reduce((total, entry) => {
      const product = getProductBySlug(entry.slug);
      if (!product) return total;
      const unitPrice = entry.unitPriceUsd ?? product.price;
      return total + unitPrice * entry.quantity;
    }, 0);
  }, [entries, getProductBySlug]);

  useEffect(() => {
    if (isDrawerOpen) {
      return;
    }

    const root = drawerRef.current;
    const active = document.activeElement;
    if (
      root instanceof HTMLElement &&
      active instanceof HTMLElement &&
      root.contains(active)
    ) {
      active.blur();
    }
  }, [isDrawerOpen]);

  if (!isHydrated || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      ref={drawerRef}
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-300",
        isDrawerOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isDrawerOpen}
      {...(!isDrawerOpen ? { inert: true as const } : {})}
    >
      <button
        type="button"
        aria-label={t("cart.closeCart")}
        onClick={closeDrawer}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={cn(
          "absolute inset-y-0 end-0 flex h-full max-h-[100dvh] w-full max-w-md flex-col border-s border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          isDrawerOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <header className="shrink-0 border-b border-border bg-primary px-5 py-4 text-background">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent">
                {t("cart.yourSelection")}
              </p>
              <h2
                id="cart-drawer-title"
                className="mt-1 text-xl font-semibold tracking-tight"
              >
                {t("cart.shoppingBag")}
              </h2>
              <p className="mt-0.5 text-xs text-background/70">
                {itemCount > 0
                  ? t("cart.bagCount", { count: itemCount })
                  : t("cart.emptyDrawerDesc")}
              </p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label={t("cart.closeBag")}
              className={cn(
                "shrink-0 rounded-full p-1.5 text-background/70",
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
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-accent"
                aria-hidden="true"
              >
                <path d="M6 6h15l-1.5 9h-12L6 6z" />
                <path d="M6 6L5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>
            <p className="text-base font-medium">{t("cart.emptyDrawer")}</p>
            <p className="mt-2 max-w-xs text-sm text-secondary">
              {t("cart.emptyDrawerDesc")}
            </p>
            <Button
              href="/products"
              variant="accent"
              onClick={closeDrawer}
              className="mt-6"
            >
              {t("cart.exploreCollection")}
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li key={entry.slug}>
                    <CartDrawerItem
                      entry={entry}
                      onNavigate={closeDrawer}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <footer className="shrink-0 border-t border-border bg-card px-5 py-4">
              <dl className="grid gap-1.5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-secondary">{t("cart.subtotal")}</dt>
                  <dd className="font-medium tabular-nums">
                    <Price amountUsd={subtotalUsd} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-secondary">{t("cart.shipping")}</dt>
                  <dd className="text-secondary">
                    {t("cart.shippingAtCheckoutShort")}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
                  <dt className="font-semibold">{t("cart.estimatedTotal")}</dt>
                  <dd className="font-semibold tabular-nums text-accent">
                    <Price amountUsd={subtotalUsd} />
                  </dd>
                </div>
              </dl>
              <p className="mt-1.5 text-[10px] leading-snug text-secondary">
                {t("common.pricesIn", { currency: currencyLabel })}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  href="/checkout"
                  variant="accent"
                  onClick={closeDrawer}
                  className="col-span-2 w-full py-2.5 text-sm"
                >
                  {t("cart.completePurchase")}
                </Button>
                <Button
                  href="/products"
                  variant="secondary"
                  onClick={closeDrawer}
                  className="w-full py-2.5 text-sm"
                >
                  {t("common.continueShopping")}
                </Button>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="flex items-center justify-center rounded-xl border border-border px-3 py-2.5 text-center text-xs font-medium text-accent transition-colors hover:border-accent/30 hover:bg-background"
                >
                  {t("cart.viewFullBag")}
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
