import type { AppNotification } from "@/features/notifications/types/notifications.types";
import type { Translator } from "@/shared/i18n/translate";

const STATUS_KEYS = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
] as const;

function isKnownStatus(
  status: string | null,
): status is (typeof STATUS_KEYS)[number] {
  return STATUS_KEYS.includes(status as (typeof STATUS_KEYS)[number]);
}

export function formatNotificationMessage(
  notification: AppNotification,
  t: Translator,
): { title: string; body: string } {
  if (notification.type === "order_status" && notification.orderNumber) {
    const statusLabel = isKnownStatus(notification.status)
      ? t(`checkout.tracking.steps.${notification.status}`)
      : notification.status ?? "";

    return {
      title: t("notifications.orderStatusTitle", {
        number: notification.orderNumber,
      }),
      body: t("notifications.orderStatusBody", { status: statusLabel }),
    };
  }

  return {
    title: t("notifications.genericTitle"),
    body: t("notifications.genericBody"),
  };
}

export function formatNotificationTime(
  iso: string,
  t: Translator,
  language: string,
): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return t("notifications.justNow");
  }

  if (minutes < 60) {
    return t("notifications.minutesAgo", { count: String(minutes) });
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t("notifications.hoursAgo", { count: String(hours) });
  }

  return date.toLocaleDateString(
    language === "ar" ? "ar" : language === "ku" ? "en-GB" : undefined,
    {
      month: "short",
      day: "numeric",
    },
  );
}
