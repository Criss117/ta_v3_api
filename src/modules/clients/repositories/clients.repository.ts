import { and, eq, or, sql } from "drizzle-orm";
import { clients } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { FindOneClientDto, ThereAreClientBy } from "../dtos/find.dto";
import type { CreateClientDto } from "../dtos/create-client.dto";
import type { UpdateClientDto } from "../dtos/update-client.dto";
import type { TX } from "@/modules/shared/models/types";

export class ClientsRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async create(data: CreateClientDto) {
    const [createdClient] = await this.db
      .insert(clients)
      .values(data)
      .returning({
        id: clients.id,
      });

    return createdClient;
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

  public async findOneSimpleBy({ clientCode, clientId }: FindOneClientDto) {
    const [client] = await this.db
      .select({
        id: clients.id,
        clientCode: clients.clientCode,
      })
      .from(clients)
      .where(
        and(
          clientId ? eq(clients.id, clientId) : sql`true`,
          clientCode ? eq(clients.clientCode, clientCode) : sql`true`,
        ),
      );

    if (!client.id) return null;

    return client;
  }

  public async update(data: UpdateClientDto, tx?: TX) {
    const { clientId, ...rest } = data;

    const db = tx ?? this.db;

    const filteredRest = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined),
    );

    return db
      .update(clients)
      .set({
        ...filteredRest,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, clientId), eq(clients.isActive, true)));
  }

  public async findOneSummary(clientId: string, tx?: TX) {
    const db = tx ?? this.db;

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId));

    return client;
  }
}
