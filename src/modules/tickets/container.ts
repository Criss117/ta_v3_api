import { dbClient } from "@/integrations/db";
import { TicketsCommandRepository } from "./repositories/tickets-command.repository";
import { TicketsQueryRepository } from "./repositories/tickets-query.repository";
import { CreateTicketUseCase } from "./use-cases/create-ticket.usecase";
import { DeleteTicketUseCase } from "./use-cases/delete-ticket.usecase";
import { DecreaseTicketTotalUseCase } from "./use-cases/decrease-ticket-total.usecase";
import { FindManyTicketsByClientUseCase } from "./use-cases/find-many-tickets-by-client";
import { IncreaseTicketTotalUseCase } from "./use-cases/increase-ticket-total.usecase";
import {
	createInstallmentPlanUseCase,
	reduceInstallmentPayUseCase,
} from "../clients/container";
import { updateProductStockUseCase } from "../products/container";

//repositories
export const ticketsCommandsRepository = new TicketsCommandRepository(
	dbClient.client,
);

export const ticketsQueryRepository = new TicketsQueryRepository(
	dbClient.client,
);

//use-cases
export const createTicketUseCase = new CreateTicketUseCase(
	ticketsCommandsRepository,
	updateProductStockUseCase,
	createInstallmentPlanUseCase,
);

export const decreaseTicketTotalUseCase = new DecreaseTicketTotalUseCase(
	ticketsQueryRepository,
	ticketsCommandsRepository,
);

export const deleteTicketUseCase = new DeleteTicketUseCase(
	ticketsQueryRepository,
	ticketsCommandsRepository,
	reduceInstallmentPayUseCase,
);

export const findManyTicketsByClientUseCase =
	new FindManyTicketsByClientUseCase(ticketsQueryRepository);

export const increaseTicketTotalUseCase = new IncreaseTicketTotalUseCase(
	ticketsQueryRepository,
	ticketsCommandsRepository,
);
