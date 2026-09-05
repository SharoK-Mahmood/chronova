import cors from "cors";
import express from "express";
import path from "node:path";

import { env } from "./env.js";
import { BACKEND_ROOT, ensureProductUploadsDir } from "./lib/uploads.js";
import { errorHandler } from "./middleware/error.js";
import { adminRouter, ordersRouter } from "./routes/orders.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { uploadsRouter } from "./routes/uploads.js";

ensureProductUploadsDir();

const app = express();

app.use(
  cors({
    origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use(
  "/uploads",
  express.static(path.join(BACKEND_ROOT, "uploads"), {
    fallthrough: false,
    maxAge: "7d",
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/uploads", uploadsRouter);

app.use(errorHandler);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`Chronova API listening on http://0.0.0.0:${env.port}`);
});
