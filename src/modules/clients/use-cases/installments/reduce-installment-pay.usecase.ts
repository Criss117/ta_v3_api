import { updateInstallmentStatus } from "@/modules/shared/utils/distribute-payments";
import { TRPCError } from "@trpc/server";
import type { TX } from "@/modules/shared/models/types";
import type { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";
import type { InstallmentsCommandRepository } from "@/modules/clients/repositories/installments-commands.repository";

export class ReduceInstallmentPayUseCase {
	constructor(
		private readonly installmentsQueryRepository: InstallmentsQueryRepository,
		private readonly installmentsCommandRepository: InstallmentsCommandRepository,
	) {}

	public async execute(clientId: string, amount: number, tx?: TX) {
		const installmentPlan =
			await this.installmentsQueryRepository.findAllByClient(clientId);

		const activePlan = installmentPlan.find((plan) => plan.status !== "paid");
		console.log({ pays: activePlan?.installments });

		if (!activePlan) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "EL cliente no tiene un plan de pagos activo",
			});
		}

		if (activePlan.totalPaid < amount) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "EL cliente no tiene un plan de pagos activo",
			});
		}

		const orderedInstallmentsPayments = activePlan.installments.sort(
			(a, b) => b.installmentNumber - a.installmentNumber,
		);

		const paymentsToUpdate = updateInstallmentStatus(
			orderedInstallmentsPayments,
			amount,
		);

		await this.installmentsCommandRepository.update(
			{
				id: activePlan.id,
				status: activePlan.totalPaid - amount === 0 ? "unpaid" : "partial",
				total: activePlan.total,
				totalPaid: activePlan.totalPaid - amount,
				payments: paymentsToUpdate,
			},
			tx,
		);
	}
}
