import type { CreateClientDto } from "@/modules/clients/dtos/create-client.dto";
import type { ClientsCommandsRepository } from "@/modules/clients/repositories/clients-commands.repository";

export class CreateClientUseCase {
  constructor(
    private readonly clientsCommandRepository: ClientsCommandsRepository,
  ) {}

  public async execute(data: CreateClientDto) {
    return this.clientsCommandRepository.create(data);
  }
}
