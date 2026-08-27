export { ProductCard } from "@/features/products/components/ProductCard";
export { ProductGrid } from "@/features/products/components/ProductGrid";
export {
  ProductCatalogProvider,
  useProductCatalog,
} from "@/features/products/context/ProductCatalogProvider";
export {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "@/features/products/services/products.service";
export type { Product, ProductSummary } from "@/features/products/types/product.types";
