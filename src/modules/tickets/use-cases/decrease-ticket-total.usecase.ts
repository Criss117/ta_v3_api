import { TRPCError } from "@trpc/server";
import type { TX } from "@/modules/shared/models/types";
import type { UpdateTotalPaidDto } from "../dtos/update-ticket.dto";
import type { TicketsQueryRepository } from "../repositories/tickets-query.repository";
import type { TicketsCommandRepository } from "../repositories/tickets-command.repository";

export class DecreaseTicketTotalUseCase {
	constructor(
		private readonly ticketsQueryRepository: TicketsQueryRepository,
		private readonly ticketsCommandRepository: TicketsCommandRepository,
	) {}

	public async execute(clientId: string, amount: number, tx?: TX) {
		if (amount <= 0) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "El monto debe ser mayor a 0",
			});
		}

		const tickets =
			await this.ticketsQueryRepository.findManySummaryByClient(clientId);

		if (tickets.length === 0) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "No hay tickets para actualizar",
			});
		}

		let amountToReduce = amount;
		const ticketsToUpdate: UpdateTotalPaidDto[] = [];

		// Recorrer en orden inverso para deshacer pagos desde los más recientes
		for (let i = tickets.length - 1; i >= 0 && amountToReduce > 0; i--) {
			const ticket = tickets[i];

			// Solo procesar tickets que tengan totalPaid > 0
			if (ticket.totalPaid > 0) {
				const amountToSubtract = Math.min(ticket.totalPaid, amountToReduce);

				ticket.totalPaid -= amountToSubtract;
				amountToReduce -= amountToSubtract;

				// Actualizar estado
				if (ticket.totalPaid === 0) {
					ticket.status = "unpaid";
				} else if (ticket.totalPaid < ticket.total) {
					ticket.status = "partial";
				} else {
					ticket.status = "paid";
				}

				ticketsToUpdate.push({
					id: ticket.id,
					totalPaid: ticket.totalPaid,
					status: ticket.status,
				});
			}
		}

		if (ticketsToUpdate.length > 0) {
			await this.ticketsCommandRepository.updateTotalPaid(ticketsToUpdate, tx);
		}
	}
}
