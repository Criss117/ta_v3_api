import { and, desc, eq, not, sql } from "drizzle-orm";
import {
	installmentPayments,
	installmentPlans,
} from "@/integrations/db/tables";
import { TRPCError } from "@trpc/server";
import { verifyInstallmentPaymentSchema } from "../mappers/schemas";
import type { DBClient } from "@/integrations/db";
import type { TX } from "@/modules/shared/models/types";
import type { InstallmentDetail } from "../entities/installments.entity";

export class InstallmentsQueryRepository {
	constructor(private readonly db: DBClient["client"]) {}

	public async findAllByClient(
		clientId: string,
		tx?: TX,
	): Promise<InstallmentDetail[]> {
		const db = tx ?? this.db;

		const plans = await db
			.select({
				id: installmentPlans.id,
				clientId: installmentPlans.clientId,
				numberOfInstallments: installmentPlans.numberOfInstallments,
				installmentsPaid: installmentPlans.installmentsPaid,
				modality: installmentPlans.modality,
				totalPaid: installmentPlans.totalPaid,
				total: installmentPlans.total,
				status: installmentPlans.status,
				createdAt: installmentPlans.createdAt,
				installments: sql<string>`json_group_array(
           	json_object (
          		'id', ${installmentPayments.id},
              'status', ${installmentPayments.status},
              'subtotal', ${installmentPayments.subtotal},
              'subtotalPaid', ${installmentPayments.subtotalPaid},
              'installmentNumber', ${installmentPayments.installmentNumber},
              'createdAt', ${installmentPayments.createdAt},
              'dueDate', ${installmentPayments.dueDate}
           	)
        )`,
			})
			.from(installmentPlans)
			.innerJoin(
				installmentPayments,
				eq(installmentPlans.id, installmentPayments.planId),
			)
			.where(
				and(
					eq(installmentPlans.clientId, clientId),
					eq(installmentPlans.isActive, true),
				),
			)
			.orderBy(desc(installmentPlans.createdAt))
			.groupBy(installmentPlans.id);

		return plans.map((p) => {
			const { installments, ...rest } = p;

			const { data, success, error } =
				verifyInstallmentPaymentSchema(installments);

			if (!data || !success) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: error.message,
				});
			}

			return {
				...rest,
				installments: data.sort(
					(a, b) => a.installmentNumber - b.installmentNumber,
				),
			};
		});
	}

	public async totalDebt(clientId: string) {
		const [plan] = await this.db
			.select({
				total: installmentPlans.total,
				totalPaid: installmentPlans.totalPaid,
			})
			.from(installmentPlans)
			.where(
				and(
					eq(installmentPlans.clientId, clientId),
					eq(installmentPlans.isActive, true),
					not(eq(installmentPlans.status, "paid")),
				),
			);

		return plan.total - plan.totalPaid;
	}
}
