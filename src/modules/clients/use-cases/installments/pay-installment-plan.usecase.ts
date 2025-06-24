import { TRPCError } from "@trpc/server";
import { distributePayment } from "@/modules/shared/utils/distribute-payments";
import type { InstallmentsCommandRepository } from "@/modules/clients/repositories/installments-commands.repository";
import type { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";
import type { PayDebtDto } from "@/modules/clients/dtos/pay-debt.dto";
import type { TX } from "@/modules/shared/models/types";

export class PayInstallmentPlanUseCase {
	constructor(
		private readonly installmentsCommandRepository: InstallmentsCommandRepository,
		private readonly installmentsQueryRepository: InstallmentsQueryRepository,
	) {}

	public async execute(data: PayDebtDto, tx?: TX) {
		if (!data.amount) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "El monto a abonar no puede ser cero",
			});
		}

		const installmentPlans =
			await this.installmentsQueryRepository.findAllByClient(data.clientId);

		const activePlan = installmentPlans.find((plan) => plan.status !== "paid");

		if (!activePlan) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "EL cliente no tiene un plan de pagos activo",
			});
		}

		const totalDebt = activePlan.total - activePlan.totalPaid;

		if (data.amount > totalDebt) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "El monto a abonar supera la deuda global del cliente",
			});
		}

		const newTotalPaid = activePlan.totalPaid + data.amount;

		const unPaidPayments = activePlan.installments.filter(
			(i) => i.status !== "paid",
		);

		const paymentsToUpdate = distributePayment(data.amount, unPaidPayments);

		await this.installmentsCommandRepository.update(
			{
				id: activePlan.id,
				status: data.amount === totalDebt ? "paid" : "partial",
				total: activePlan.total,
				totalPaid: newTotalPaid,
				payments: paymentsToUpdate,
			},
			tx,
		);
	}
}
