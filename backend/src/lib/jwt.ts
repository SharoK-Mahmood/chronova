import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../env.js";

export type JwtPayload = {
  sub: string;
  role: "customer" | "admin";
};

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (typeof decoded !== "object" || decoded === null || typeof decoded.sub !== "string") {
    throw new Error("Invalid token");
  }

  const role = decoded.role === "admin" ? "admin" : "customer";

  return { sub: decoded.sub, role };
}
