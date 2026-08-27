import { z } from "zod";

import { conflict, unauthorized } from "../lib/http-error.js";
import { signAccessToken } from "../lib/jwt.js";
import { hashPassword, verifyPassword } from "../lib/passwords.js";
import { prisma } from "../lib/prisma.js";
import { toPublicUser, type AuthUser } from "../middleware/auth.js";

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});

function toAuthUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role === "admin" ? "admin" : "customer",
  };
}

export function toAuthSession(user: AuthUser) {
  return {
    user: toPublicUser(user),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
  };
}

export async function register(input: unknown) {
  const data = registerSchema.parse(input);
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw conflict("An account with this email already exists", "EMAIL_IN_USE");
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      role: "customer",
    },
  });

  return toAuthSession(toAuthUser(user));
}

export async function login(input: unknown) {
  const data = loginSchema.parse(input);
  const email = data.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
    throw unauthorized("Invalid email or password");
  }

  return toAuthSession(toAuthUser(user));
}
