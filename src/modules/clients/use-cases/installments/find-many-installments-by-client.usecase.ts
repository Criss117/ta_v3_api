import type { InstallmentsQueryRepository } from "@/modules/clients/repositories/installments-query.repository";

export class FindManyInstallmentsByClientUseCase {
	constructor(
		private readonly installmentsQueryRepository: InstallmentsQueryRepository,
	) {}

	public execute(clientId: string) {
		return this.installmentsQueryRepository.findAllByClient(clientId);
	}
}
