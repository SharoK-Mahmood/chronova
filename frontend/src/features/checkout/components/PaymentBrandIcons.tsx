import { cn } from "@/shared/lib/utils/cn";

type IconProps = {
  className?: string;
  title?: string;
};

export function VisaIcon({ className, title = "Visa" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-4 w-6", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M19.5 21.2h-2.6l1.6-10.4h2.6l-1.6 10.4zm11.2-10.1l-1.6.4-.3-.7c-.5-.2-1.1-.4-1.7-.4-1.8 0-3.1 1-3.1 2.4 0 1.1.9 1.7 1.7 2.1.8.4 1.1.6 1.1 1 0 .5-.6.8-1.1.8-.7 0-1.2-.2-1.7-.4l-.3-.1-.3 1.8c.5.2 1.4.4 2.3.4 2.1 0 3.4-1 3.4-2.6 0-1.3-.8-1.9-2.1-2.5-.7-.4-1.1-.6-1.1-1 0-.3.4-.7 1.2-.7.6 0 1.1.1 1.5.3l.2.1.6-1.6zm5.4 0h-2l-3.1 10.4h2.5l.5-1.4h3.1l.3 1.4h2.2l-2.5-10.4zm-2.7 7.1l1.3-3.5.7 3.5h-2zm-15.5-7.1l-2.4 6.5-.3-1.3c-.5-1.6-2-3.4-3.7-4.2l2.2 9.4h2.6l3.9-10.4h-2.3z"
      />
      <path
        fill="#F9A33B"
        d="M9.2 10.8H6.4l-.1.4C10.2 12.3 12 14.5 12.6 16.8l-.4-2.1-1.1-5.5-.1-.4z"
      />
    </svg>
  );
}

export function MastercardIcon({ className, title = "Mastercard" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-4 w-6", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M24 10.2a8 8 0 0 1 2.9 5.8A8 8 0 0 1 24 21.8a8 8 0 0 1-2.9-5.8A8 8 0 0 1 24 10.2z"
      />
    </svg>
  );
}

export function AmexIcon({ className, title = "American Express" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-4 w-6", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="48" height="32" rx="4" fill="#2E77BC" />
      <path
        fill="#fff"
        d="M8.5 12.2h3.2l.8 1.9.8-1.9h3.1v7.6h-2.1v-4.6l-1.2 2.8h-1.4l-1.2-2.8v4.6h-2V12.2zm11.6 0h5.8v1.8h-3.7v1.2h3.5v1.7h-3.5v1.2h3.8v1.7h-5.9V12.2zm8.2 0h2.2l1.6 5.2 1.6-5.2h2.2l-2.8 7.6h-2L26.1 12.2h2.2z"
      />
    </svg>
  );
}

export function PayPalIcon({ className, title = "PayPal" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-4 w-6", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="48" height="32" rx="4" fill="#F5F7FA" stroke="#E2E8F0" />
      <path
        fill="#003087"
        d="M18.2 8.5h6.4c2.8 0 4.5 1.4 4.2 4-.4 3.2-2.6 5-5.5 5h-2.4l-.8 4.8h-2.7l2.8-13.8z"
      />
      <path
        fill="#009CDE"
        d="M20.1 10.2h4.2c1.6 0 2.7.7 2.5 2.3-.3 2-1.6 3.1-3.5 3.1h-1.7l-.9 5.2h-1.8l2.2-10.6z"
      />
      <path fill="#012169" d="M15.4 8.5h2.8l-2.8 13.8h-2.7L15.4 8.5z" />
    </svg>
  );
}

export function BankTransferIcon({
  className,
  title = "Bank transfer",
}: IconProps) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-4 w-6", className)}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      <rect width="48" height="32" rx="4" fill="#F3F1EC" stroke="#D7D2C8" />
      <path
        stroke="#1A1A1A"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 20.5h20M16.5 20.5V14h15v6.5M18.5 14v6.5M24 14v6.5M29.5 14v6.5M15.5 14l8.5-4.5 8.5 4.5"
      />
    </svg>
  );
}

export function CardBrandIcons({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden>
      <VisaIcon />
      <MastercardIcon />
      <AmexIcon />
    </span>
  );
}
