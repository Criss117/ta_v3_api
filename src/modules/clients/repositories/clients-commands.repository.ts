import { and, eq } from "drizzle-orm";
import { clients } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { CreateClientDto } from "../dtos/create-client.dto";
import type { UpdateClientDto } from "../dtos/update-client.dto";
import type { TX } from "@/modules/shared/models/types";

export class ClientsCommandsRepository {
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

  public async update(data: UpdateClientDto, tx?: TX) {
    const db = tx ?? this.db;
    const { clientId, ...rest } = data;

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
}
