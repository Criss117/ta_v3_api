import { dbClient } from "@/integrations/db";
import { TRPCError } from "@trpc/server";
import type { PaymentsCommandRepository } from "@/modules/clients/repositories/payments-commands.repository";
import type { PaymentsQueryRepository } from "@/modules/clients/repositories/payments-query.repository";
import type { DeleteManyPaymentsByIdsDto } from "@/modules/clients/dtos/delete-many-payments-by-ids.dto";
import type { ReduceInstallmentPayUseCase } from "@/modules/clients/use-cases/installments/reduce-installment-pay.usecase";
import type { DecreaseTicketTotalUseCase } from "@/modules/tickets/use-cases/decrease-ticket-total.usecase";

export class DeleteManyPaymentsUseCase {
	constructor(
		private readonly paymentsQueryRepository: PaymentsQueryRepository,
		private readonly paymentsCommandRepository: PaymentsCommandRepository,
		private readonly reduceInstallmentPayUseCase: ReduceInstallmentPayUseCase,
		private readonly decreaseTicketTotalUseCase: DecreaseTicketTotalUseCase,
	) {}

	public async execute(meta: DeleteManyPaymentsByIdsDto) {
		const payments = await this.paymentsQueryRepository.findAllByIds(meta);

		if (payments.length !== meta.ids.length) {
			throw new TRPCError({
				code: "BAD_REQUEST",
			});
		}

		const total = payments.reduce((acc, p) => p.amount + acc, 0);

		return dbClient.transaction(async (tx) => {
			const deletePaymentsPromises =
				this.paymentsCommandRepository.deleteManyByIds(meta, tx);

			const decressTotalPaidPromise = this.decreaseTicketTotalUseCase.execute(
				meta.clientId,
				total,
				tx,
			);

			const reducePayPromises = this.reduceInstallmentPayUseCase.execute(
				meta.clientId,
				total,
				tx,
			);

			return Promise.all([
				reducePayPromises,
				deletePaymentsPromises,
				decressTotalPaidPromise,
			]);
		});
	}
}
