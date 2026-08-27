import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/route-param.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  createOrder,
  getOrderByNumber,
  getOrderCounts,
  listOrders,
  updateOrderStatus,
} from "../services/orders.service.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await createOrder((req as AuthedRequest).user, req.body);
    res.status(201).json(order);
  }),
);

ordersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await listOrders((req as AuthedRequest).user);
    res.json(orders);
  }),
);

ordersRouter.get(
  "/:orderNumber",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await getOrderByNumber(
      (req as AuthedRequest).user,
      routeParam(req.params.orderNumber),
    );
    res.json(order);
  }),
);

ordersRouter.patch(
  "/:orderNumber/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = await updateOrderStatus(routeParam(req.params.orderNumber), req.body);
    res.json(order);
  }),
);

export const adminRouter = Router();

adminRouter.get(
  "/overview",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const overview = await getOrderCounts();
    res.json(overview);
  }),
);
