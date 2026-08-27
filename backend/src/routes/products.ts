import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/route-param.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../services/products.service.js";

export const productsRouter = Router();

productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const brand = typeof req.query.brand === "string" ? req.query.brand : undefined;
    const products = await listProducts({ category, brand });
    res.json(products);
  }),
);

productsRouter.get(
  "/:idOrSlug",
  asyncHandler(async (req, res) => {
    const product = await getProduct(routeParam(req.params.idOrSlug));
    res.json(product);
  }),
);

productsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  }),
);

productsRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const product = await updateProduct(routeParam(req.params.id), req.body);
    res.json(product);
  }),
);

productsRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await deleteProduct(routeParam(req.params.id));
    res.status(204).send();
  }),
);
