import { notFound } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import type { AuthUser } from "../middleware/auth.js";

export type NotificationResponse = {
  id: string;
  type: string;
  orderNumber: string | null;
  status: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

function toNotificationResponse(notification: {
  id: string;
  type: string;
  orderNumber: string | null;
  status: string | null;
  readAt: Date | null;
  createdAt: Date;
}): NotificationResponse {
  return {
    id: notification.id,
    type: notification.type,
    orderNumber: notification.orderNumber,
    status: notification.status,
    href: notification.orderNumber
      ? `/orders/${notification.orderNumber}`
      : null,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}

export async function createOrderStatusNotification(input: {
  userId: string;
  orderNumber: string;
  status: string;
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { pushNotifications: true },
  });

  // Respect the account preference for order status alerts.
  if (!user?.pushNotifications) {
    return null;
  }

  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: "order_status",
      orderNumber: input.orderNumber,
      status: input.status,
    },
  });

  return toNotificationResponse(notification);
}

export async function listNotifications(user: AuthUser, limit = 20) {
  const take = Math.min(Math.max(limit, 1), 50);

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.notification.count({
      where: { userId: user.id, readAt: null },
    }),
  ]);

  return {
    notifications: notifications.map(toNotificationResponse),
    unreadCount,
  };
}

export async function markNotificationRead(user: AuthUser, id: string) {
  const existing = await prisma.notification.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    throw notFound("Notification");
  }

  if (existing.readAt) {
    return toNotificationResponse(existing);
  }

  const notification = await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });

  return toNotificationResponse(notification);
}

export async function markAllNotificationsRead(user: AuthUser) {
  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return listNotifications(user);
}

export async function deleteNotification(user: AuthUser, id: string) {
  const existing = await prisma.notification.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    throw notFound("Notification");
  }

  await prisma.notification.delete({ where: { id } });
}

export async function clearAllNotifications(user: AuthUser) {
  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  return {
    notifications: [] as NotificationResponse[],
    unreadCount: 0,
  };
}
