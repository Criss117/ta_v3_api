import { z } from "zod";
import { clientId } from "./value-objects";

export const deleteManyPaymentsByIdsDto = z.object({
  ids: z
    .array(
      z.number().int().positive({
        message: "Los IDs deben ser números enteros positivos",
      }),
    )
    .min(1, {
      message: "Debe proporcionar al menos un ID",
    })
    .max(100, {
      message: "No puede eliminar más de 100 elementos a la vez",
    }),
  clientId: clientId,
});

export type DeleteManyPaymentsByIdsDto = z.infer<
  typeof deleteManyPaymentsByIdsDto
>;
