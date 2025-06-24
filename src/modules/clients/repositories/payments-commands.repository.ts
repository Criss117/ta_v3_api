import { and, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { payments } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { TX } from "@/modules/shared/models/types";
import type { PayDebtDto } from "../dtos/pay-debt.dto";
import type { DeleteManyPaymentsByIdsDto } from "../dtos/delete-many-payments-by-ids.dto";

export class PaymentsCommandRepository {
	constructor(private readonly db: DBClient["client"]) {}

	public async create(data: PayDebtDto, tx?: TX) {
		if (!data.amount) {
			throw new TRPCError({
				code: "BAD_REQUEST",
			});
		}
		const db = tx ?? this.db;

		await db.insert(payments).values({
			amount: data.amount,
			clientId: data.clientId,
		});
	}

	public async deleteManyByIds(
		{ clientId, ids }: DeleteManyPaymentsByIdsDto,
		tx?: TX,
	) {
		const db = tx ?? this.db;

		return db
			.update(payments)
			.set({
				isActive: false,
				deletedAt: new Date(),
			})
			.where(and(inArray(payments.id, ids), eq(payments.clientId, clientId)));
	}

	public async deleteAllByClient(clientId: string, tx?: TX) {
		const db = tx ?? this.db;

		return db
			.update(payments)
			.set({
				isActive: false,
				deletedAt: new Date(),
			})
			.where(eq(payments.clientId, clientId));
	}
}
