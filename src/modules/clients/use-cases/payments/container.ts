import {
	decreaseTicketTotalUseCase,
	increaseTicketTotalUseCase,
} from "@/modules/tickets/container";
import { PayInstallmentPlanUseCase } from "../installments/pay-installment-plan.usecase";
import { ReduceInstallmentPayUseCase } from "../installments/reduce-installment-pay.usecase";
import { DeleteManyPaymentsUseCase } from "./delete-many-payments.usecase";
import { FindManyPaymentsByClientUseCase } from "./find-many-payments-by-client.usecase";
import { PayDebtUseCase } from "./pay-debt.usecase";
import {
	installmentsCommandRepository,
	installmentsQueryRepository,
	paymentsCommandsRepository,
	paymentsQueryRepository,
} from "@/modules/clients/repositories/container";

export const payInstallmentPlanUseCase = new PayInstallmentPlanUseCase(
	installmentsCommandRepository,
	installmentsQueryRepository,
);

export const reduceInstallmentPayUseCase = new ReduceInstallmentPayUseCase(
	installmentsQueryRepository,
	installmentsCommandRepository,
);

//payments
export const deleteManyPaymentsUseCase = new DeleteManyPaymentsUseCase(
	paymentsQueryRepository,
	paymentsCommandsRepository,
	reduceInstallmentPayUseCase,
	decreaseTicketTotalUseCase,
);

export const findManyPaymentsByClientUseCase =
	new FindManyPaymentsByClientUseCase(paymentsQueryRepository);

export const payDebtUseCase = new PayDebtUseCase(
	installmentsQueryRepository,
	paymentsCommandsRepository,
	payInstallmentPlanUseCase,
	increaseTicketTotalUseCase,
);
