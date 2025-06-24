import { and, desc, eq, inArray, lte, or, sql } from "drizzle-orm";
import { payments } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { FindManyPaymentsDto } from "../dtos/find-many-payments.dto";
import type { DeleteManyPaymentsByIdsDto } from "../dtos/delete-many-payments-by-ids.dto";

export class PaymentsQueryRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async findManyByClient({
    cursor,
    limit,
    clientId,
  }: FindManyPaymentsDto) {
    return this.db
      .select({
        id: payments.id,
        clientId: payments.clientId,
        amount: payments.amount,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(
        and(
          or(
            cursor.createdAt
              ? lte(payments.createdAt, cursor.createdAt)
              : sql`true`,
            and(
              cursor.createdAt
                ? eq(payments.createdAt, cursor.createdAt)
                : sql`true`,
              cursor.lastId ? lte(payments.id, cursor.lastId) : sql`true`,
            ),
          ),

          eq(payments.clientId, clientId),
          eq(payments.isActive, true),
        ),
      )
      .limit(limit + 1)
      .orderBy(desc(payments.createdAt));
  }

  public async findAllByIds({ clientId, ids }: DeleteManyPaymentsByIdsDto) {
    return this.db
      .select({
        id: payments.id,
        amount: payments.amount,
        clientId: payments.clientId,
      })
      .from(payments)
      .where(
        and(
          eq(payments.isActive, true),
          eq(payments.clientId, clientId),
          inArray(payments.id, ids),
        ),
      );
  }
}
