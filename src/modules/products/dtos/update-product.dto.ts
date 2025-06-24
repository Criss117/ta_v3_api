import type { z } from "zod";
import { baseProductDto } from "./base-product.dto";

export const updateProductDto = baseProductDto
  .partial()
  .refine(
    (data) =>
      data.salePrice === undefined ||
      data.costPrice === undefined ||
      data.salePrice > data.costPrice,
    {
      message: "El precio de venta debe ser mayor que el precio de costo",
      path: ["salePrice"],
    },
  )
  .refine(
    (data) =>
      data.salePrice === undefined ||
      data.wholesalePrice === undefined ||
      data.salePrice > data.wholesalePrice,
    {
      message: "El precio de venta debe ser mayor que el precio al por mayor",
      path: ["salePrice"],
    },
  )
  .refine(
    (data) =>
      data.wholesalePrice === undefined ||
      data.costPrice === undefined ||
      data.wholesalePrice > data.costPrice,
    {
      message: "El precio al por mayor debe ser mayor que el precio de costo",
      path: ["wholesalePrice"],
    },
  )
  .refine(
    (data) =>
      data.stock === undefined ||
      data.minStock === undefined ||
      data.stock >= data.minStock,
    {
      message: "El stock debe ser mayor o igual que el stock mínimo",
      path: ["stock"],
    },
  );

export type UpdateProductDto = z.infer<typeof updateProductDto>;
