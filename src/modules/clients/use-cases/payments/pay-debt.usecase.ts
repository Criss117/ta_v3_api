import { dbClient } from "@/integrations/db";
import type { PayDebtDto } from "@/modules/clients/dtos/pay-debt.dto";
import type { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";
import type { PaymentsCommandRepository } from "@/modules/clients/repositories/payments-commands.repository";
import type { PayInstallmentPlanUseCase } from "@/modules/clients/use-cases/installments/pay-installment-plan.usecase";
import type { IncreaseTicketTotalUseCase } from "@/modules/tickets/use-cases/increase-ticket-total.usecase";

export class PayDebtUseCase {
	constructor(
		private readonly installmentsQueryRepository: InstallmentsQueryRepository,
		private readonly paymentsCommandRepository: PaymentsCommandRepository,
		private readonly payInstallmentPlanUseCase: PayInstallmentPlanUseCase,
		private readonly increaseTicketTotalUseCase: IncreaseTicketTotalUseCase,
	) {}

	public async execute(data: PayDebtDto) {
		let amount = data.amount || 0;

		if (data.type === "settle_debt") {
			const totalDebt = await this.installmentsQueryRepository.totalDebt(
				data.clientId,
			);

			amount = totalDebt;
		}

		await dbClient.transaction(async (tx) => {
			if (data.type === "pay_debt") {
				await this.paymentsCommandRepository.create(
					{
						...data,
						amount,
					},
					tx,
				);
			}

			if (data.type === "settle_debt") {
				await this.paymentsCommandRepository.deleteAllByClient(
					data.clientId,
					tx,
				);
			}

			const updateInstallmentsPromise = this.payInstallmentPlanUseCase.execute(
				{
					...data,
					amount,
				},
				tx,
			);

			const updateTicketTotalPaid = this.increaseTicketTotalUseCase.execute(
				data.clientId,
				amount,
				tx,
			);

			await Promise.all([updateInstallmentsPromise, updateTicketTotalPaid]);
		});
	}
}
