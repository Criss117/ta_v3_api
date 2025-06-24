import { z } from "zod";
import { payType } from "@/integrations/db/shared";
import { createTicketItemDto } from "./create-ticket-item.dto";

export const createTicketDto = z
  .object({
    payType: z.enum(payType, {
      required_error: "Selecciona un tipo de ticket",
      invalid_type_error: "El tipo de ticket debe ser 'cash' o 'credit'",
    }),
    clientId: z
      .string({
        required_error: "Selecciona un cliente",
        invalid_type_error: "El cliente debe ser una cadena de texto",
      })
      .nullish(),
    items: z
      .array(createTicketItemDto, {
        required_error: "Agrega al menos un item",
        invalid_type_error: "Los items deben estar en una lista válida",
      })
      .min(1, {
        message: "Agrega al menos un item",
      }),
  })
  .refine(
    (data) => {
      const isCredit = data.payType === "credit";
      const hasClient = !!data.clientId;

      return !(isCredit && !hasClient);
    },
    {
      message: "Selecciona un cliente para este tipo de crédito",
      path: ["clientId"],
    },
  );

export type CreateTicketDto = z.infer<typeof createTicketDto>;
