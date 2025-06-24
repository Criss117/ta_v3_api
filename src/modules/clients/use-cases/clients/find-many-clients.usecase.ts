import { calculateNextCursor } from "@/modules/shared/utils/next-cursor";
import type { Paginated } from "@/modules/shared/dtos/cursor.dto";
import type { ClientSummary } from "@/modules/clients/entities/client.entity";
import type { FindManyClientsDto } from "@/modules/clients/dtos/find-many-clients.dto";
import type { ClientsQueryRepositoy } from "@/modules/clients/repositories/clients-query.repository";

export class FindManyClientsUseCase {
  constructor(private readonly clientsQueryRepository: ClientsQueryRepositoy) {}

  public async execute(
    meta: FindManyClientsDto,
  ): Promise<Paginated<ClientSummary, FindManyClientsDto["cursor"]>> {
    const data = await this.clientsQueryRepository.findMany(meta);

    const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);

    const nextCursor: FindManyClientsDto["cursor"] = {
      lastClientCode: hasMore ? lastItem.clientCode : null,
      createdAt: hasMore ? lastItem.createdAt : null,
    };

    return {
      items,
      nextCursor,
    };
  }
}
