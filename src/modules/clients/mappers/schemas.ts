import { z } from "zod";
import { ticketStatus } from "@/integrations/db/shared";

export const installmentPaymentSummaryDto = z.object({
  id: z
    .number({ invalid_type_error: "El ID debe ser un número" })
    .int("El ID debe ser un número entero")
    .nonnegative("El ID no puede ser negativo"),

  status: z.enum(ticketStatus, {
    errorMap: () => ({
      message: "El estado debe ser 'unpaid', 'paid' o 'partial'",
    }),
  }),

  subtotalPaid: z
    .number({ invalid_type_error: "El subTotalPaid debe ser un número" })
    .nonnegative("El subTotalPaid no puede ser negativo"),

  subtotal: z
    .number({ invalid_type_error: "El subtotal debe ser un número" })
    .nonnegative("El subtotal no puede ser negativo"),

  installmentNumber: z
    .number({ invalid_type_error: "El número de cuota debe ser un número" })
    .int("El número de cuota debe ser un número entero")
    .positive("El número de cuota debe ser mayor que cero"),

  dueDate: z.number().transform((val) => new Date(val * 1000)), // Convertir timestamp Unix a Date

  createdAt: z.number().transform((val) => new Date(val * 1000)), // Convertir timestamp Unix a Date
});

export type InstallmentsPaymentSchema = z.infer<
  typeof installmentPaymentSummaryDto
>;

export function verifyInstallmentPaymentSchema(data: string) {
  return z.array(installmentPaymentSummaryDto).safeParse(JSON.parse(data));
}
