import {
	createClientUseCase,
	findManyClientsUseCase,
	findManyInstallmentsByClientUseCase,
	findOneClientByUseCase,
	updateClientUseCase,
} from "../container";
import { createTRPCRouter, protectedProcedure } from "@/integrations/trpc";
import { createClientDto } from "../dtos/create-client.dto";
import { updateClientDto } from "../dtos/update-client.dto";
import { findManyClientsDto } from "../dtos/find-many-clients.dto";
import { clientId } from "../dtos/value-objects";
import { findOneClientByDto } from "../dtos/find-one-client-by.dto";
import { findManyPaymentsDto } from "../dtos/find-many-payments.dto";
import { payDebtDto } from "../dtos/pay-debt.dto";
import { deleteManyPaymentsByIdsDto } from "../dtos/delete-many-payments-by-ids.dto";
import {
	findManyPaymentsByClientUseCase,
	payDebtUseCase,
	deleteManyPaymentsUseCase,
} from "../use-cases/payments/container";

export const clientsController = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyClientsDto)
		.query(({ input }) => findManyClientsUseCase.execute(input)),

	findOneBy: protectedProcedure
		.input(findOneClientByDto)
		.query(({ input }) => findOneClientByUseCase.execute(input)),

	findManyInstallments: protectedProcedure
		.input(clientId)
		.query(({ input }) => findManyInstallmentsByClientUseCase.execute(input)),

	findManyPayments: protectedProcedure
		.input(findManyPaymentsDto)
		.query(({ input }) => findManyPaymentsByClientUseCase.execute(input)),

	createClient: protectedProcedure
		.input(createClientDto)
		.mutation(({ input }) => createClientUseCase.execute(input)),

	updateClient: protectedProcedure
		.input(updateClientDto)
		.mutation(({ input }) => updateClientUseCase.execute(input)),

	payDebt: protectedProcedure
		.input(payDebtDto)
		.mutation(({ input }) => payDebtUseCase.execute(input)),

	deleteManyPayments: protectedProcedure
		.input(deleteManyPaymentsByIdsDto)
		.mutation(({ input }) => deleteManyPaymentsUseCase.execute(input)),
});
