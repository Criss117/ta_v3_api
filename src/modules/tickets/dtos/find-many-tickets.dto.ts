import { z } from "zod";

export const ticketItemDto = z.object({
  id: z
    .number({ invalid_type_error: "El ID debe ser un número" })
    .int("El ID debe ser un entero")
    .nonnegative("El ID no puede ser negativo"),

  productId: z
    .number({ invalid_type_error: "El productId debe ser un número" })
    .int("El productId debe ser un entero")
    .nonnegative("El productId no puede ser negativo"),

  description: z
    .string({ required_error: "La descripción es requerida" })
    .min(1, "La descripción no puede estar vacía"),

  quantity: z
    .number({ invalid_type_error: "El amount debe ser un número" })
    .nonnegative("El amount no puede ser negativo"),

  subtotal: z
    .number({ invalid_type_error: "El subtotal debe ser un número" })
    .nonnegative("El subtotal no puede ser negativo"),
});

export const ticketItemsDto = z.array(ticketItemDto);

export type ticketItemDto = z.infer<typeof ticketItemDto>;
