import { dbClient } from "@/integrations/db";
import { ClientsCommandsRepository } from "./clients-commands.repository";
import { ClientsQueryRepositoy } from "./clients-query.repository";
import { InstallmentsCommandRepository } from "./installments-commands.repository";
import { InstallmentsQueryRepository } from "./installments-query.repository";
import { PaymentsCommandRepository } from "./payments-commands.repository";
import { PaymentsQueryRepository } from "./payments-query.repository";

export const clientsCommandsRepository = new ClientsCommandsRepository(
	dbClient.client,
);

export const clientsQueryRepository = new ClientsQueryRepositoy(
	dbClient.client,
);

export const installmentsQueryRepository = new InstallmentsQueryRepository(
	dbClient.client,
);

export const installmentsCommandRepository = new InstallmentsCommandRepository(
	dbClient.client,
);

export const paymentsQueryRepository = new PaymentsQueryRepository(
	dbClient.client,
);

export const paymentsCommandsRepository = new PaymentsCommandRepository(
	dbClient.client,
);
