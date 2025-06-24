import { calculateInstallments } from "@/modules/shared/utils/calculate-installments";
import { generateDueDates } from "@/modules/shared/utils/dueDates";
import type { TX } from "@/modules/shared/models/types";
import type { CreateInstallmentPlanDto } from "@/modules/clients/dtos/create-installment.dto";
import type { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";
import type { InstallmentsCommandRepository } from "@/modules/clients/repositories/installments-commands.repository";
import type { FindOneClientByUseCase } from "../clients/find-one-client-by.usecase";

export class CreateInstallmentPlanUseCase {
  constructor(
    private readonly installmentsQueryRepository: InstallmentsQueryRepository,
    private readonly installmentsCommandRepository: InstallmentsCommandRepository,
    private readonly findOneClientByUseCase: FindOneClientByUseCase,
  ) {}

  public async execute(data: CreateInstallmentPlanDto, tx?: TX) {
    const existingPlans =
      await this.installmentsQueryRepository.findAllByClient(data.clientId, tx);

    const activePlan = existingPlans.find((p) => p.status !== "paid");

    if (activePlan && activePlan.id !== null) {
      const unPaidPayments = activePlan.installments.filter(
        (i) => i.status !== "paid",
      );

      const totalDebt = activePlan.total - activePlan.totalPaid;

      const totalDistributed = calculateInstallments(
        totalDebt + data.total,
        unPaidPayments.length,
      );

      const paymentsToUpdate = unPaidPayments.map((payment, index) => ({
        ...payment,
        subtotal: totalDistributed[index],
      }));

      return this.installmentsCommandRepository.update(
        {
          id: activePlan.id,
          status: data.total === activePlan.total ? "paid" : "partial",
          total: activePlan.total + data.total,
          totalPaid: activePlan.totalPaid,
          payments: paymentsToUpdate,
        },
        tx,
      );
    }

    const client = await this.findOneClientByUseCase.execute({
      clientId: data.clientId,
    });

    const installments = calculateInstallments(
      data.total,
      client.globalNumberOfInstallments,
    );

    const dueDates = generateDueDates(
      client.globalInstallmentModality,
      client.globalNumberOfInstallments,
    );

    const paymentsToInsert = installments.map((total, index) => ({
      subtotal: total,
      installmentNumber: index + 1,
      dueDate: dueDates[index],
    }));

    return this.installmentsCommandRepository.create(
      {
        clientId: client.id,
        modality: client.globalInstallmentModality,
        numberOfInstallments: client.globalNumberOfInstallments,
        total: data.total,
        payments: paymentsToInsert,
      },
      tx,
    );
  }
}
