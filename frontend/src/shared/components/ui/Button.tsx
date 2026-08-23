import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  interactiveButtonClasses,
  luxuryButtonMotionClasses,
  luxuryPrimaryHoverClasses,
  luxurySecondaryHoverClasses,
} from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

const variants = {
  primary:
    "bg-primary text-background shadow-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-accent/20",
  secondary:
    "border border-border bg-transparent hover:border-accent/50 hover:bg-accent/5 hover:shadow-md hover:ring-2 hover:ring-accent/15",
  ghost:
    "bg-transparent hover:bg-border/60 hover:shadow-sm hover:ring-2 hover:ring-accent/10",
  accent:
    "bg-accent text-primary shadow-sm hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 hover:ring-2 hover:ring-accent/40",
} as const;

const luxuryVariants = {
  primary: cn(
    "bg-primary text-background",
    luxuryPrimaryHoverClasses,
  ),
  secondary: cn(
    "border border-border bg-transparent",
    luxurySecondaryHoverClasses,
  ),
  ghost: variants.ghost,
  accent: cn(
    "bg-accent text-primary",
    luxuryPrimaryHoverClasses,
  ),
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonEffect = "default" | "luxury";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  effect?: ButtonEffect;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function LuxuryButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="btn-luxury-shimmer pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span className="relative z-10">{children}</span>
    </>
  );
}

export function Button({
  variant = "primary",
  effect = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  const isLuxury = effect === "luxury";
  const motionClasses = isLuxury
    ? luxuryButtonMotionClasses
    : interactiveButtonClasses;
  const variantClasses = isLuxury ? luxuryVariants[variant] : variants[variant];
  const content = isLuxury ? (
    <LuxuryButtonContent>{children}</LuxuryButtonContent>
  ) : (
    children
  );

  const classes = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5",
    typography.btn,
    motionClasses,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none",
    variantClasses,
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
