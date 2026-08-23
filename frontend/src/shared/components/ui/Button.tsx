import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils/cn";

const variants = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90",
  secondary:
    "border border-foreground/15 bg-transparent hover:bg-foreground/5",
  ghost: "bg-transparent hover:bg-foreground/5",
} as const;

type ButtonVariant = keyof typeof variants;

type ButtonBaseProps = {
  variant?: ButtonVariant;
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

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  const buttonProps = props as ButtonAsButton;
  return <button className={classes} {...buttonProps} />;
}
