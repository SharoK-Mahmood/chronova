import { OAuth2Client } from "google-auth-library";
import { z } from "zod";

import { env } from "../env.js";
import { badRequest, conflict, unauthorized } from "../lib/http-error.js";
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

const googleSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
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

function splitName(fullName: string | undefined, email: string) {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    const local = email.split("@")[0] || "Chronova";
    return { firstName: local, lastName: "Customer" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "Customer" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
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

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  if (!user.passwordHash) {
    throw unauthorized(
      "This account uses Google Sign-In. Please continue with Google.",
    );
  }

  if (!(await verifyPassword(data.password, user.passwordHash))) {
    throw unauthorized("Invalid email or password");
  }

  return toAuthSession(toAuthUser(user));
}

export async function loginWithGoogle(input: unknown) {
  if (!env.googleClientId) {
    throw badRequest(
      "Google Sign-In is not configured on the server",
      "GOOGLE_NOT_CONFIGURED",
    );
  }

  const { credential } = googleSchema.parse(input);
  const client = new OAuth2Client(env.googleClientId);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw unauthorized("Invalid Google Sign-In token");
  }

  if (!payload?.sub || !payload.email) {
    throw unauthorized("Google account is missing required profile details");
  }

  if (payload.email_verified === false) {
    throw unauthorized("Google email address is not verified");
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;
  const { firstName, lastName } = splitName(payload.name, email);

  const existingByGoogle = await prisma.user.findUnique({
    where: { googleId },
  });

  if (existingByGoogle) {
    return toAuthSession(toAuthUser(existingByGoogle));
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email } });

  if (existingByEmail) {
    const linked = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId,
        firstName: existingByEmail.firstName || firstName,
        lastName: existingByEmail.lastName || lastName,
      },
    });

    return toAuthSession(toAuthUser(linked));
  }

  const user = await prisma.user.create({
    data: {
      email,
      googleId,
      passwordHash: null,
      firstName,
      lastName,
      role: "customer",
    },
  });

  return toAuthSession(toAuthUser(user));
}
