import type {
	InstallmentModality,
	TicketStaus,
} from "@/integrations/db/shared";
import type {
	installmentPayments,
	installmentPlans,
} from "@/integrations/db/tables";
import type { InstallmentsPaymentSchema } from "../mappers/schemas";

export type InstallmentPlanDB = typeof installmentPlans.$inferSelect;
export type InstallmentPaymentDB = typeof installmentPayments.$inferSelect;

export interface InstallmentDetail {
	id: number;
	clientId: string;
	numberOfInstallments: number;
	installmentsPaid: number;
	modality: InstallmentModality;
	totalPaid: number;
	total: number;
	status: TicketStaus;
	createdAt: Date;
	installments: InstallmentsPaymentSchema[];
}
