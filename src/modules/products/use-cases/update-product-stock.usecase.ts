import type { TX } from "@/modules/shared/models/types";
import type { UpdateStockDto } from "../dtos/update-stock.dto";
import type { ProductsCommandRepository } from "../repositories/products-command.repository";

export class UpdateProductStockUseCase {
	constructor(
		private readonly productsCommandRepository: ProductsCommandRepository,
	) {}

	public async execute(data: UpdateStockDto, tx?: TX) {
		return this.productsCommandRepository.updateStock(data, tx);
	}
}
