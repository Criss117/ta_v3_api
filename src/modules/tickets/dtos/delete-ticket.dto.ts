import { z } from "zod";

export const deleteTicketDto = z.object({
  clientId: z.string({
    required_error: "Selecciona un cliente",
    invalid_type_error: "El cliente debe ser una cadena de texto",
  }),
  ticketId: z
    .number({
      required_error: "El ticket es requerido",
    })
    .min(1, { message: "El id del ticket debe ser mayor a 0" })
    .int(),
});

export type DeleteTicketDto = z.infer<typeof deleteTicketDto>;
