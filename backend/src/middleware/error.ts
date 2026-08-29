import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { ZodError } from "zod";

import { HttpError } from "../lib/http-error.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, code: error.code });
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        message: "Image must be 5MB or smaller",
        code: "IMAGE_TOO_LARGE",
      });
      return;
    }

    res.status(400).json({ message: error.message, code: "UPLOAD_ERROR" });
    return;
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Invalid request";
    res.status(400).json({ message, code: "VALIDATION_ERROR" });
    return;
  }

  if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ message: "Authentication required", code: "UNAUTHORIZED" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error", code: "INTERNAL_ERROR" });
}
