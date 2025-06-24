import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  like,
  lte,
  max,
  or,
  sql,
} from "drizzle-orm";
import { clients, installmentPlans, tickets } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { FindOneClientByDto } from "../dtos/find-one-client-by.dto";
import type { FindManyClientsDto } from "../dtos/find-many-clients.dto";
import type { ClientDetail, ClientSummary } from "../entities/client.entity";
import type { ThereAreClientBy } from "../dtos/find.dto";
import type { TX } from "@/modules/shared/models/types";

export class ClientsQueryRepositoy {
  constructor(private readonly db: DBClient["client"]) {}

  public async findOneClientDetailBy(
    meta: FindOneClientByDto,
  ): Promise<ClientDetail | null> {
    const [client] = await this.db
      .select({
        ...getTableColumns(clients),
        totalTickets: count(tickets.id),
        totalTicketsUnpaid: sql<number>`SUM(CASE WHEN ${tickets.status} = 'unpaid' OR ${tickets.status} = 'partial' THEN 1 ELSE 0 END)`,
        totalTicketsPaid: sql<number>`SUM(CASE WHEN ${tickets.status} = 'paid' THEN 1 ELSE 0 END)`,
        totalDebt: sql<number>`
          (SELECT SUM(${installmentPlans.total} - ${installmentPlans.totalPaid})
          FROM ${installmentPlans}
          WHERE (${clients.id} = ${installmentPlans.clientId})
          AND ${installmentPlans.status} != 'paid'
          AND ${installmentPlans.isActive} = true)
        `,
        totalInstallments: sql<number>`
          (SELECT COUNT(${installmentPlans.id})
          FROM ${installmentPlans}
          WHERE ${clients.id} = ${installmentPlans.clientId})
        `,
        lastTicketDate: max(tickets.createdAt),
      })
      .from(clients)
      .leftJoin(tickets, eq(clients.id, tickets.clientId))
      .where(
        and(
          meta.clientId ? eq(clients.id, meta.clientId) : sql`true`,
          meta.clientCode ? eq(clients.clientCode, meta.clientCode) : sql`true`,
        ),
      );

    if (!client.id) return null;

    return { ...client, totalDebt: client.totalDebt || 0 };
  }

  public async findMany({ cursor, limit, searchQuery }: FindManyClientsDto) {
    return this.db
      .select()
      .from(clients)
      .where(
        and(
          or(
            cursor.createdAt
              ? lte(clients.createdAt, cursor.createdAt)
              : sql`true`,
            and(
              cursor.createdAt
                ? eq(clients.createdAt, cursor.createdAt)
                : sql`true`,
              cursor.lastClientCode
                ? lte(clients.clientCode, cursor.lastClientCode)
                : sql`true`,
            ),
          ),
          or(
            searchQuery
              ? like(clients.fullName, `%${searchQuery}%`)
              : sql`true`,
            searchQuery
              ? like(clients.clientCode, `%${searchQuery}%`)
              : sql`true`,
          ),
          eq(clients.isActive, true),
        ),
      )
      .orderBy(desc(clients.createdAt))
      .limit(limit + 1);
  }

  public async exitingBy({ clientCode, email, phone, id }: ThereAreClientBy) {
    const conditions = [];

    if (clientCode) {
      conditions.push(eq(clients.clientCode, clientCode));
    }

    if (email) {
      conditions.push(eq(clients.email, email));
    }

    if (phone) {
      conditions.push(eq(clients.phone, phone));
    }

    if (conditions.length === 0) {
      return []; // o lanzar un error si esperas al menos un campo
    }

    return this.db
      .select({
        id: clients.id,
        clientCode: clients.clientCode,
        globalInstallmentModality: clients.globalInstallmentModality,
        globalNumberOfInstallments: clients.globalNumberOfInstallments,
      })
      .from(clients)
      .where(or(...conditions, eq(clients.id, id)));
  }

  public async findOneSummary(
    clientId: string,
    tx?: TX,
  ): Promise<ClientSummary | null> {
    const db = tx ?? this.db;

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId));

    if (!client || !client.id) {
      return null;
    }

    return client;
  }
}
