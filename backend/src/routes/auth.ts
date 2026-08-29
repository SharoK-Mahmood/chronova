import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, toPublicUser, type AuthedRequest } from "../middleware/auth.js";
import {
  getAccountPreferences,
  updateAccountPreferences,
} from "../services/account-preferences.service.js";
import {
  login,
  loginWithGoogle,
  register,
  updateProfile,
} from "../services/auth.service.js";

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

authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const session = await loginWithGoogle(req.body);
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

authRouter.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await updateProfile((req as AuthedRequest).user.id, req.body);
    res.json({ user });
  }),
);

authRouter.get(
  "/me/preferences",
  requireAuth,
  asyncHandler(async (req, res) => {
    const preferences = await getAccountPreferences(
      (req as AuthedRequest).user.id,
    );
    res.json({ preferences });
  }),
);

authRouter.patch(
  "/me/preferences",
  requireAuth,
  asyncHandler(async (req, res) => {
    const preferences = await updateAccountPreferences(
      (req as AuthedRequest).user.id,
      req.body,
    );
    res.json({ preferences });
  }),
);
