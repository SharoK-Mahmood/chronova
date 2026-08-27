"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AdminProductForm } from "@/features/admin";
import { getProduct } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/product.types";
import { useTranslation } from "@/shared/i18n";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void getProduct(params.id)
      .then(setProduct)
      .catch(() => setError(t("admin.loadError")));
  }, [params.id, t]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!product) {
    return <p className="text-secondary">{t("common.loading")}</p>;
  }

  return <AdminProductForm product={product} />;
}
