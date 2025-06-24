import { TRPCError } from "@trpc/server";
import { dbClient } from "@/integrations/db";
import type { DeleteTicketDto } from "../dtos/delete-ticket.dto";
import type { TicketsCommandRepository } from "../repositories/tickets-command.repository";
import type { TicketsQueryRepository } from "../repositories/tickets-query.repository";
import type { ReduceInstallmentPayUseCase } from "@/modules/clients/use-cases/installments/reduce-installment-pay.usecase";

export class DeleteTicketUseCase {
	constructor(
		private readonly ticketsQueryRepository: TicketsQueryRepository,
		private readonly ticketsCommandRepository: TicketsCommandRepository,
		private readonly reduceInstallmentPayUseCase: ReduceInstallmentPayUseCase,
	) {}

	public async execute({ ticketId, clientId }: DeleteTicketDto) {
		const ticket = await this.ticketsQueryRepository.findOneTicket(
			ticketId,
			clientId,
		);

		if (!ticket) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "No se encontró el ticket",
			});
		}

		return dbClient.transaction(async (tx) => {
			const deleteTicketPromise = this.ticketsCommandRepository.delete(
				ticketId,
				clientId,
				tx,
			);

			const reducePaysPromises = this.reduceInstallmentPayUseCase.execute(
				clientId,
				ticket.total,
				tx,
			);

			return Promise.all([deleteTicketPromise, reducePaysPromises]);
		});
	}
}
