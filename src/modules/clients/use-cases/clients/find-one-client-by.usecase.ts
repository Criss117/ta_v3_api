import { TRPCError } from "@trpc/server";
import type { FindOneClientByDto } from "@/modules/clients/dtos/find-one-client-by.dto";
import type { ClientsQueryRepositoy } from "@/modules/clients/repositories/clients-query.repository";
import type { ClientDetail } from "@/modules/clients/entities/client.entity";

export class FindOneClientByUseCase {
  constructor(private readonly clientsQueryRepository: ClientsQueryRepositoy) {}

  public async execute(meta: FindOneClientByDto): Promise<ClientDetail> {
    const client =
      await this.clientsQueryRepository.findOneClientDetailBy(meta);

    if (!client) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "El cliente no existe",
      });
    }

    return client;
  }
}
