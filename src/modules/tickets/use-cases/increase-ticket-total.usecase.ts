import { TRPCError } from "@trpc/server";
import type { TX } from "@/modules/shared/models/types";
import type { TicketsQueryRepository } from "../repositories/tickets-query.repository";
import type { TicketsCommandRepository } from "../repositories/tickets-command.repository";
import type { UpdateTotalPaidDto } from "../dtos/update-ticket.dto";

export class IncreaseTicketTotalUseCase {
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

		let amountToAssign = amount;
		const ticketsToUpdate: UpdateTotalPaidDto[] = [];

		for (const ticket of tickets) {
			if (amountToAssign === 0) break;

			const balanceDue = ticket.total - ticket.totalPaid;
			const toPay = Math.min(balanceDue, amountToAssign);

			ticket.totalPaid += toPay;
			amountToAssign -= toPay;

			// Actualizar estado
			if (ticket.totalPaid === ticket.total) {
				ticket.status = "paid";
			} else if (ticket.totalPaid > 0) {
				ticket.status = "partial";
			}

			ticketsToUpdate.push({
				id: ticket.id,
				totalPaid: ticket.totalPaid,
				status: ticket.status,
			});
		}

		if (ticketsToUpdate.length < 0) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "No hay tickets para actualizar",
			});
		}

		return this.ticketsCommandRepository.updateTotalPaid(ticketsToUpdate, tx);
	}
}
