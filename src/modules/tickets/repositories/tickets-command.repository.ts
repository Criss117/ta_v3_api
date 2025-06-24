import { and, eq } from "drizzle-orm";
import { ticketItems, tickets } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { TX } from "@/modules/shared/models/types";
import type { UpdateTotalPaidDto } from "../dtos/update-ticket.dto";
import type { CreateTicketDto } from "../dtos/create-ticket.dto";

export class TicketsCommandRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async create(data: CreateTicketDto, tx?: TX) {
    const db = tx ?? this.db;

    const { items, ...ticket } = data;
    const isCredit = ticket.payType === "credit";
    const total = items.reduce((acc, t) => acc + t.price * t.quantity, 0);

    return db.transaction(async (tx) => {
      const [{ id: ticketId }] = await tx
        .insert(tickets)
        .values({
          total,
          status: isCredit ? "unpaid" : "paid",
          clientId: isCredit ? ticket.clientId : null,
        })
        .returning({
          id: tickets.id,
        });

      const insertItems = items.map((i) => ({
        ...i,
        ticketId,
        subtotal: i.price * i.quantity,
      }));

      await tx.insert(ticketItems).values(insertItems);

      return ticketId;
    });
  }

  public async updateTotalPaid(data: UpdateTotalPaidDto[], tx?: TX) {
    const db = tx ?? this.db;

    const updateTicketsPromises = data.map(async (d) =>
      db
        .update(tickets)
        .set({
          status: d.status,
          totalPaid: d.totalPaid,
          updatedAt: new Date(),
        })
        .where(eq(tickets.id, d.id)),
    );

    return Promise.all(updateTicketsPromises);
  }

  public async delete(ticketId: number, clientId: string, tx?: TX) {
    const db = tx ?? this.db;

    return db
      .update(tickets)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(tickets.id, ticketId),
          eq(tickets.isActive, true),
          eq(tickets.clientId, clientId),
        ),
      );
  }
}
