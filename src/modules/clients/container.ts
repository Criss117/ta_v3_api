import { FindManyClientsUseCase } from "./use-cases/clients/find-many-clients.usecase";
import { FindManyInstallmentsByClientUseCase } from "./use-cases/installments/find-many-installments-by-client.usecase";
import { FindOneClientByUseCase } from "./use-cases/clients/find-one-client-by.usecase";
import { CreateClientUseCase } from "./use-cases/clients/create-client.usecase";
import { UpdateClientUseCase } from "./use-cases/clients/update-client.usecase";
import { PayInstallmentPlanUseCase } from "./use-cases/installments/pay-installment-plan.usecase";
import { ReduceInstallmentPayUseCase } from "./use-cases/installments/reduce-installment-pay.usecase";
import { CreateInstallmentPlanUseCase } from "./use-cases/installments/create-installment-plan.usecase";

import {
  clientsCommandsRepository,
  clientsQueryRepository,
  installmentsCommandRepository,
  installmentsQueryRepository,
} from "./repositories/container";

//use-cases
//Clients
export const createClientUseCase = new CreateClientUseCase(
  clientsCommandsRepository,
);

export const findManyClientsUseCase = new FindManyClientsUseCase(
  clientsQueryRepository,
);

export const findOneClientByUseCase = new FindOneClientByUseCase(
  clientsQueryRepository,
);

export const updateClientUseCase = new UpdateClientUseCase(
  clientsCommandsRepository,
  clientsQueryRepository,
  installmentsQueryRepository,
);

//installments
export const createInstallmentPlanUseCase = new CreateInstallmentPlanUseCase(
  installmentsQueryRepository,
  installmentsCommandRepository,
  findOneClientByUseCase,
);

export const findManyInstallmentsByClientUseCase =
  new FindManyInstallmentsByClientUseCase(installmentsQueryRepository);

export const payInstallmentPlanUseCase = new PayInstallmentPlanUseCase(
  installmentsCommandRepository,
  installmentsQueryRepository,
);

export const reduceInstallmentPayUseCase = new ReduceInstallmentPayUseCase(
  installmentsQueryRepository,
  installmentsCommandRepository,
);
