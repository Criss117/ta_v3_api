import type {
  installmentPayments,
  installmentPlans,
} from "@/integrations/db/tables";
import { z } from "zod";
import { clientId } from "./value-objects";

export const createInstallmentPlanDto = z.object({
  clientId: clientId,
  total: z
    .number({
      required_error: "El total es requerido",
      invalid_type_error: "El total debe ser un número",
    })
    .positive("El total debe ser un número positivo"),
});

export type InsertInstallmentPlan = typeof installmentPlans.$inferInsert & {
  payments: Omit<InsertInstallmentPayment, "planId">[];
};
export type InsertInstallmentPayment = typeof installmentPayments.$inferInsert;
export type CreateInstallmentPlanDto = z.infer<typeof createInstallmentPlanDto>;
