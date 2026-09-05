import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/route-param.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  clearAllNotifications,
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notifications.service.js";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await listNotifications((req as AuthedRequest).user);
    res.json(result);
  }),
);

notificationsRouter.post(
  "/read-all",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await markAllNotificationsRead((req as AuthedRequest).user);
    res.json(result);
  }),
);

notificationsRouter.delete(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await clearAllNotifications((req as AuthedRequest).user);
    res.json(result);
  }),
);

notificationsRouter.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    const notification = await markNotificationRead(
      (req as AuthedRequest).user,
      routeParam(req.params.id),
    );
    res.json(notification);
  }),
);

notificationsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await deleteNotification(
      (req as AuthedRequest).user,
      routeParam(req.params.id),
    );
    res.status(204).send();
  }),
);
