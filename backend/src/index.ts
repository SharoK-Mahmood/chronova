import cors from "cors";
import express from "express";

import { env } from "./env.js";
import { errorHandler } from "./middleware/error.js";
import { adminRouter, ordersRouter } from "./routes/orders.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Chronova API listening on http://localhost:${env.port}`);
});
