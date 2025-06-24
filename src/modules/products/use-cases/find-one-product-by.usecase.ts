import { TRPCError } from "@trpc/server";
import type { FindOneProductByDto } from "../dtos/find.dto";
import type { ProductsQueryRepository } from "../repositories/products-query.repository";

export class FindOneProductByUseCase {
	constructor(
		private readonly productsQueryRepository: ProductsQueryRepository,
	) {}

	public async execute(meta: FindOneProductByDto) {
		if (!meta.barcode && !meta.productId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
			});
		}

		const product = await this.productsQueryRepository.findOneBy(meta);

		if (!product) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "El producto no existe",
			});
		}

		return product;
	}
}
