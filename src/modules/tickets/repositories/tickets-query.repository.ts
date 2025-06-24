import { and, asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { ticketItems, tickets } from "@/integrations/db/tables";
import { ticketItemsDto } from "../dtos/find-many-tickets.dto";
import type { DBClient } from "@/integrations/db";
import type { FindManyByClient } from "../dtos/find.dto";

export class TicketsQueryRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async findManyByClient({ clientId }: FindManyByClient) {
    const data = await this.db
      .select({
        ...getTableColumns(tickets),
        items: sql<string>`json_group_array(
           	json_object (
          		'id', ${ticketItems.id},
          		'productId', ${ticketItems.productId},
          		'description', ${ticketItems.description},
          		'quantity', ${ticketItems.quantity},
          		'subtotal', ${ticketItems.subtotal}
           	)
        )`,
      })
      .from(tickets)
      .innerJoin(ticketItems, eq(tickets.id, ticketItems.ticketId))
      .where(and(eq(tickets.clientId, clientId), eq(tickets.isActive, true)))
      .groupBy(tickets.id)
      .orderBy(desc(tickets.createdAt));

    return data.map((d) => {
      const { success, data, error } = ticketItemsDto.safeParse(
        JSON.parse(d.items),
      );

      if (!success || !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return {
        ...d,
        items: data,
      };
    });
  }

  public async findManySummaryByClient(clientId: string) {
    return this.db
      .select({
        id: tickets.id,
        total: tickets.total,
        totalPaid: tickets.totalPaid,
        status: tickets.status,
      })
      .from(tickets)
      .where(and(eq(tickets.clientId, clientId), eq(tickets.isActive, true)))
      .orderBy(asc(tickets.createdAt));
  }

  public async findOneTicket(ticketId: number, clientId: string) {
    const [ticket] = await this.db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.id, ticketId),
          eq(tickets.clientId, clientId),
          eq(tickets.isActive, true),
        ),
      );

    if (!ticket || !ticket.id) {
      return null;
    }

    return ticket;
  }
}
