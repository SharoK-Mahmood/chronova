import { apiClient } from "@/shared/lib/api/client";
import type {
  AppNotification,
  NotificationsListResponse,
} from "@/features/notifications/types/notifications.types";

export async function listNotifications(): Promise<NotificationsListResponse> {
  return apiClient<NotificationsListResponse>("/notifications");
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  return apiClient<AppNotification>(
    `/notifications/${encodeURIComponent(id)}/read`,
    { method: "PATCH" },
  );
}

export async function markAllNotificationsRead(): Promise<NotificationsListResponse> {
  return apiClient<NotificationsListResponse>("/notifications/read-all", {
    method: "POST",
  });
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient<void>(`/notifications/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function clearAllNotifications(): Promise<NotificationsListResponse> {
  return apiClient<NotificationsListResponse>("/notifications", {
    method: "DELETE",
  });
}
