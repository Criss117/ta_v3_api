import type { TicketsQueryRepository } from "../repositories/tickets-query.repository";

export class FindManyTicketsByClientUseCase {
	constructor(
		private readonly ticketsQueryRepository: TicketsQueryRepository,
	) {}

	public async execute(clientId: string) {
		return this.ticketsQueryRepository.findManyByClient({
			clientId,
		});
	}
}
