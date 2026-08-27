import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, toPublicUser, type AuthedRequest } from "../middleware/auth.js";
import { login, register } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const session = await register(req.body);
    res.status(201).json(session);
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const session = await login(req.body);
    res.json(session);
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: toPublicUser((req as AuthedRequest).user) });
  }),
);
