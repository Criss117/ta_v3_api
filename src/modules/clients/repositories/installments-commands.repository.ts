import {
  installmentPayments,
  installmentPlans,
} from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { TX } from "@/modules/shared/models/types";
import type { InsertInstallmentPlan } from "../dtos/create-installment.dto";
import type { UpdateInstallmentPlanDto } from "../dtos/update-installment.dto";
import { and, eq } from "drizzle-orm";

export class InstallmentsCommandRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async create(data: InsertInstallmentPlan, tx?: TX) {
    const db = tx ?? this.db;

    return db.transaction(async (tx) => {
      const [planCreated] = await tx
        .insert(installmentPlans)
        .values({
          clientId: data.clientId,
          modality: data.modality,
          numberOfInstallments: data.numberOfInstallments,
          total: data.total,
        })
        .returning({
          id: installmentPlans.id,
        });

      const createPaymentsPromises = data.payments.map((p) =>
        tx.insert(installmentPayments).values({
          dueDate: p.dueDate,
          installmentNumber: p.installmentNumber,
          planId: planCreated.id,
          subtotal: p.subtotal,
        }),
      );

      await Promise.all(createPaymentsPromises);
    });
  }

  public async update(data: UpdateInstallmentPlanDto, tx?: TX) {
    const { payments, ...plan } = data;
    const db = tx ?? this.db;

    return db.transaction(async (tx) => {
      await tx
        .update(installmentPlans)
        .set({
          total: plan.total,
          totalPaid: plan.totalPaid,
          status: plan.status,
          updatedAt: new Date(),
        })
        .where(eq(installmentPlans.id, plan.id));

      const updateInstallmentPayments = payments.map((p) =>
        tx
          .update(installmentPayments)
          .set({
            subtotalPaid: p.subtotalPaid,
            subtotal: p.subtotal,
            status: p.status,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(installmentPayments.id, p.id),
              eq(installmentPayments.planId, plan.id),
            ),
          ),
      );

      await Promise.all(updateInstallmentPayments);
    });
  }
}
