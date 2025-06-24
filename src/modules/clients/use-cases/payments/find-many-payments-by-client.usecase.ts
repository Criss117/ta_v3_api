import { calculateNextCursor } from "@/modules/shared/utils/next-cursor";
import type { FindManyPaymentsDto } from "@/modules/clients/dtos/find-many-payments.dto";
import type { PaymentsQueryRepository } from "@/modules/clients/repositories/payments-query.repository";
import type {
	BaseCursorDto,
	Paginated,
} from "@/modules/shared/dtos/cursor.dto";
import type { PaymentSummary } from "@/modules/clients/entities/payment.entity";

export class FindManyPaymentsByClientUseCase {
	constructor(
		private readonly paymentsQueryRepository: PaymentsQueryRepository,
	) {}

	public async execute(
		meta: FindManyPaymentsDto,
	): Promise<Paginated<PaymentSummary, BaseCursorDto>> {
		const payments = await this.paymentsQueryRepository.findManyByClient(meta);

		const { hasMore, items, lastItem } = calculateNextCursor(
			payments,
			meta.limit,
		);

		const nextCursor = {
			lastId: hasMore ? lastItem.id : null,
			createdAt: hasMore ? lastItem.createdAt : null,
		};

		return {
			items,
			nextCursor,
		};
	}
}
