import type { z } from "zod";
import { baseProductDto } from "./base-product.dto";

export const createProductDto = baseProductDto
  .refine((data) => data.salePrice > data.costPrice, {
    message: "El precio de venta debe ser mayor que el precio de costo",
    path: ["salePrice"],
  })
  .refine((data) => data.salePrice > data.wholesalePrice, {
    message: "El precio de venta debe ser mayor que el precio al por mayor",
    path: ["salePrice"],
  })
  .refine((data) => data.wholesalePrice > data.costPrice, {
    message: "El precio al por mayor debe ser mayor que el precio de costo",
    path: ["wholesalePrice"],
  })
  .refine((data) => data.stock >= data.minStock, {
    message: "El stock debe ser mayor o igual que el stock mínimo",
    path: ["stock"],
  })
  .refine((data) => data.minStock <= data.stock, {
    message: "El stock mínimo debe ser menor o igual que el stock",
    path: ["minStock"],
  });

export type CreateProductDto = z.infer<typeof createProductDto>;
