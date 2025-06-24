import { TRPCError } from "@trpc/server";
import type { TX } from "@/modules/shared/models/types";
import type { ClientsCommandsRepository } from "@/modules/clients/repositories/clients-commands.repository";
import type { UpdateClientDto } from "@/modules/clients/dtos/update-client.dto";
import type { ClientsQueryRepositoy } from "@/modules/clients/repositories/clients-query.repository";
import { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";

export class UpdateClientUseCase {
  constructor(
    private readonly clientsCommandRepository: ClientsCommandsRepository,
    private readonly clientsQueryRepository: ClientsQueryRepositoy,
    private readonly installmentsQueryRepository: InstallmentsQueryRepository,
  ) {}

  public async execute(data: UpdateClientDto, tx?: TX) {
    const existingClient = await this.clientsQueryRepository.findOneSummary(
      data.clientId,
    );

    if (!existingClient) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "El cliente no existe",
      });
    }

    if (
      data.globalInstallmentModality !==
        existingClient.globalInstallmentModality ||
      data.globalNumberOfInstallments !==
        existingClient.globalNumberOfInstallments
    ) {
      const plans = await this.installmentsQueryRepository.findAllByClient(
        data.clientId,
      );

      const activePlan = plans.find((plan) => plan.status !== "paid");

      if (activePlan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El cliente tiene un plan de pagos activo",
        });
      }
    }

    return this.clientsCommandRepository.update(data, tx);
  }
}
