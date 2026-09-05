"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import {
  clearAllNotifications,
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/services/notifications.service";
import type { AppNotification } from "@/features/notifications/types/notifications.types";

const POLL_INTERVAL_MS = 8_000;
export const NOTIFICATIONS_CHANGED_EVENT = "chronova:notifications-changed";
const NOTIFICATIONS_SYNC_KEY = "chronova:notifications-sync";

export function notifyNotificationsChanged() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
  try {
    window.localStorage.setItem(NOTIFICATIONS_SYNC_KEY, String(Date.now()));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

type NotificationsProviderProps = {
  children: ReactNode;
};

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const result = await listNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch {
      // Keep existing state on transient failures.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    void refresh().finally(() => {
      if (!cancelled) {
        setIsLoading(false);
      }
    });

    const intervalId = window.setInterval(() => {
      void refresh();
    }, POLL_INTERVAL_MS);

    function handleVisibilityOrFocus() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    function handleNotificationsChanged() {
      void refresh();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === NOTIFICATIONS_SYNC_KEY) {
        void refresh();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    window.addEventListener(
      NOTIFICATIONS_CHANGED_EVENT,
      handleNotificationsChanged,
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener(
        NOTIFICATIONS_CHANGED_EVENT,
        handleNotificationsChanged,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [isAuthenticated, isHydrated, refresh]);

  const markRead = useCallback(async (id: string) => {
    const updated = await markNotificationRead(id);
    setNotifications((current) => {
      const next = current.map((item) => (item.id === id ? updated : item));
      setUnreadCount(next.filter((item) => !item.readAt).length);
      return next;
    });
  }, []);

  const markAllRead = useCallback(async () => {
    const result = await markAllNotificationsRead();
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteNotification(id);
    setNotifications((current) => {
      const next = current.filter((item) => item.id !== id);
      setUnreadCount(next.filter((item) => !item.readAt).length);
      return next;
    });
  }, []);

  const clearAll = useCallback(async () => {
    const result = await clearAllNotifications();
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markRead,
      markAllRead,
      remove,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markRead,
      markAllRead,
      remove,
      clearAll,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }

  return context;
}
