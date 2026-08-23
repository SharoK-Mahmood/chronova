"use client";

import { useCart } from "@/features/cart/context/CartProvider";
import { Button } from "@/shared/components/ui/Button";
import {
  interactiveIconButtonClasses,
} from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { useTranslation } from "@/shared/i18n";

type AddToCartButtonProps = {
  slug: string;
  productName: string;
  unitPriceUsd?: number;
  variant?: "icon" | "button";
  className?: string;
};

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12L6 6z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export function AddToCartButton({
  slug,
  productName,
  unitPriceUsd,
  variant = "icon",
  className,
}: AddToCartButtonProps) {
  const { t } = useTranslation();
  const { addToCart, isInCart, getQuantity } = useCart();
  const inCart = isInCart(slug);
  const quantity = getQuantity(slug);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(slug, { unitPriceUsd });
  }

  if (variant === "button") {
    return (
      <Button
        type="button"
        onClick={handleClick}
        className={cn("gap-2", className)}
      >
        <CartIcon className="h-4 w-4" />
        {inCart ? t("cart.inCart", { count: quantity }) : t("cart.addToCart")}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${t("cart.addToCart")}: ${productName}`}
      className={cn(
        "rounded-full bg-card/90 p-2 shadow-sm ring-1 ring-border backdrop-blur-sm",
        interactiveIconButtonClasses,
        inCart
          ? "text-accent ring-accent/30 hover:bg-accent/10 hover:ring-accent/40"
          : "text-secondary hover:text-accent hover:ring-accent/30",
        className,
      )}
    >
      <CartIcon className="h-5 w-5" />
    </button>
  );
}
