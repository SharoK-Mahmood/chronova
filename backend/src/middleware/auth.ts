import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../lib/jwt.js";
import { forbidden, unauthorized } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
};

export type AuthedRequest = Request & { user: AuthUser };

export function toPublicUser(user: AuthUser) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim() || null;
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw unauthorized();
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw unauthorized("Session is no longer valid");
    }

    (req as AuthedRequest).user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "admin" ? "admin" : "customer",
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const user = (req as AuthedRequest).user;

  if (!user) {
    next(unauthorized());
    return;
  }

  if (user.role !== "admin") {
    next(forbidden("Admin access required"));
    return;
  }

  next();
}
