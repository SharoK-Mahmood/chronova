"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { useNotifications } from "@/features/notifications/context/NotificationsProvider";
import {
  formatNotificationMessage,
  formatNotificationTime,
} from "@/features/notifications/lib/format-notification";
import { useTranslation } from "@/shared/i18n";
import { navIconButtonClasses } from "@/shared/lib/utils/button-interaction";
import { cn } from "@/shared/lib/utils/cn";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className ?? "h-3.5 w-3.5"}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type NotificationBellProps = {
  className?: string;
};

export function NotificationBell({ className }: NotificationBellProps) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { isAuthenticated, isHydrated } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    remove,
    clearAll,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    void refresh();

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, refresh]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  const label =
    unreadCount > 0
      ? t("notifications.unreadAria", { count: String(unreadCount) })
      : t("notifications.title");

  async function handleItemClick(id: string, href: string | null) {
    setOpen(false);
    try {
      await remove(id);
    } catch {
      // Navigation still proceeds.
    }
    if (href) {
      router.push(href);
    }
  }

  async function handleDelete(event: MouseEvent<HTMLButtonElement>, id: string) {
    event.stopPropagation();
    try {
      await remove(id);
    } catch {
      // Keep the list as-is on failure.
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        title={t("notifications.title")}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "relative rounded-full p-2 text-secondary",
          navIconButtonClasses,
          open && "bg-background text-accent ring-1 ring-accent/30",
        )}
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute end-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold tracking-tight">
              {t("notifications.title")}
            </p>
            {notifications.length > 0 ? (
              <button
                type="button"
                className="text-xs font-medium text-accent hover:underline"
                onClick={() => {
                  void clearAll();
                }}
              >
                {t("notifications.clearAll")}
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-secondary">
                {t("common.loading")}
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-secondary">
                {t("notifications.empty")}
              </p>
            ) : (
              <ul>
                {notifications.map((notification) => {
                  const { title, body } = formatNotificationMessage(
                    notification,
                    t,
                  );
                  const unread = !notification.readAt;

                  return (
                    <li
                      key={notification.id}
                      className="border-b border-border last:border-0"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-1 px-2 py-1",
                          unread && "bg-accent/5",
                        )}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() =>
                            void handleItemClick(
                              notification.id,
                              notification.href,
                            )
                          }
                          className="min-w-0 flex-1 rounded-lg px-2 py-2 text-start transition-colors hover:bg-background/70"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium leading-snug">
                              {title}
                            </p>
                            <span className="shrink-0 text-[11px] text-secondary">
                              {formatNotificationTime(
                                notification.createdAt,
                                t,
                                language,
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-secondary">
                            {body}
                          </p>
                          {unread ? (
                            <span className="mt-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                          ) : null}
                        </button>
                        <button
                          type="button"
                          aria-label={t("notifications.delete")}
                          title={t("notifications.delete")}
                          onClick={(event) =>
                            void handleDelete(event, notification.id)
                          }
                          className="mt-1.5 shrink-0 rounded-full p-1.5 text-secondary transition-colors hover:bg-background hover:text-foreground"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-border px-4 py-2.5">
            <Link
              href="/account/settings#notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-secondary hover:text-accent"
            >
              {t("notifications.manage")}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
