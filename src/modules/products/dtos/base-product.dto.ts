import { z } from "zod";

export const baseProductDto = z.object({
  barcode: z
    .string({ required_error: "El código de barras es requerido" })
    .max(255, {
      message: "El código de barras no puede exceder los 255 caracteres",
    })
    .trim()
    .min(1, { message: "El código de barras no puede estar vacío" }),

  description: z
    .string({ required_error: "La descripción es requerida" })
    .max(255, {
      message: "La descripción no puede exceder los 255 caracteres",
    })
    .trim()
    .min(1, { message: "La descripción no puede estar vacía" }),

  costPrice: z.coerce
    .number({ required_error: "El precio de costo es requerido" })
    .positive({ message: "El precio de costo debe ser un número positivo" }),

  salePrice: z.coerce
    .number({ required_error: "El precio de venta es requerido" })
    .positive({ message: "El precio de venta debe ser un número positivo" }),

  wholesalePrice: z.coerce
    .number({ required_error: "El precio al por mayor es requerido" })
    .positive({
      message: "El precio al por mayor debe ser un número positivo",
    }),

  stock: z.coerce.number({ required_error: "El stock es requerido" }).positive({
    message: "El stock debe ser un número positivo",
  }),

  minStock: z.coerce
    .number({ required_error: "El stock mínimo es requerido" })
    .positive({
      message: "El stock mínimo debe ser un número positivo",
    }),
  categoryId: z.coerce.number().positive().nullish(),
});
