import { z } from "zod";

export const createTicketItemDto = z.object({
  productId: z
    .number({
      required_error: "Selecciona un producto",
      invalid_type_error: "El producto debe ser un número",
    })
    .int("El producto debe ser un número entero")
    .positive("Selecciona un producto válido"),

  description: z
    .string({
      required_error: "La descripción es obligatoria",
      invalid_type_error: "La descripción debe ser texto",
    })
    .max(255, "La descripción no puede superar los 255 caracteres"),

  price: z
    .number({
      required_error: "El precio es obligatorio",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive("El precio debe ser mayor que cero"),

  quantity: z
    .number({
      required_error: "La cantidad es obligatoria",
      invalid_type_error: "La cantidad debe ser un número entero",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor que cero"),
});

export type CreateTicketItemDto = z.infer<typeof createTicketItemDto>;
