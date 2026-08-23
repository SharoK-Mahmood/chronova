"use client";

import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/shared/lib/utils/cn";

type WishlistButtonProps = {
  slug: string;
  productName: string;
  variant?: "icon" | "button";
  className?: string;
};

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.5l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 0 1 6.5 3c1.74 0 3.41.81 4.5 2.09A6.32 6.32 0 0 1 15.5 3 4.5 4.5 0 0 1 20 7.5c0 3.78-3.4 6.86-8.55 11.68L12 20.5z" />
    </svg>
  );
}

export function WishlistButton({
  slug,
  productName,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isHydrated } = useWishlist();
  const saved = isHydrated && isInWishlist(slug);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(slug);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={
          saved
            ? `Remove ${productName} from wishlist`
            : `Add ${productName} to wishlist`
        }
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
          saved
            ? "border-accent bg-accent/10 text-accent hover:bg-accent/15"
            : "border-border bg-transparent hover:bg-border/60",
          "hover:scale-[1.03] active:scale-[0.98]",
          className,
        )}
      >
        <HeartIcon filled={saved} className="h-4 w-4" />
        {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      className={cn(
        "rounded-full bg-card/90 p-2 shadow-sm ring-1 ring-border backdrop-blur-sm transition-all duration-200",
        saved
          ? "text-accent ring-accent/30 hover:bg-accent/10"
          : "text-secondary hover:text-accent hover:ring-accent/20",
        "hover:scale-110 active:scale-95",
        className,
      )}
    >
      <HeartIcon filled={saved} className="h-5 w-5" />
    </button>
  );
}
