import { createTRPCRouter, protectedProcedure } from "@/integrations/trpc";
import { createTicketDto } from "../dtos/create-ticket.dto";
import { findManyByClient } from "../dtos/find.dto";
import { deleteTicketDto } from "../dtos/delete-ticket.dto";
import {
	createTicketUseCase,
	deleteTicketUseCase,
	findManyTicketsByClientUseCase,
} from "../container";

export const ticketsController = createTRPCRouter({
	create: protectedProcedure
		.input(createTicketDto)
		.mutation(({ input }) => createTicketUseCase.execute(input)),

	findManyByClient: protectedProcedure
		.input(findManyByClient)
		.query(({ input }) =>
			findManyTicketsByClientUseCase.execute(input.clientId),
		),

	delete: protectedProcedure
		.input(deleteTicketDto)
		.mutation(({ input }) => deleteTicketUseCase.execute(input)),
});
