export type OrderStatusNotificationStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered";

export type AppNotification = {
  id: string;
  type: "order_status" | string;
  orderNumber: string | null;
  status: OrderStatusNotificationStatus | string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsListResponse = {
  notifications: AppNotification[];
  unreadCount: number;
};
