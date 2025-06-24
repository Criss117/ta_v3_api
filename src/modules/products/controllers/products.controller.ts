import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/integrations/trpc";
import { createProductDto } from "../dtos/create-product.dto";
import { updateProductDto } from "../dtos/update-product.dto";
import { findOneProductByDto } from "../dtos/find.dto";
import {
	createProductUseCase,
	deleteProductUseCase,
	findManyProductsUseCase,
	findOneProductByUseCase,
	updatePorductUseCase,
} from "../container";
import { findManyProductsDto } from "../dtos/find-many-products.dto";

export const productsProcedure = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyProductsDto)
		.query(({ input }) => findManyProductsUseCase.execute(input)),

	create: protectedProcedure
		.input(createProductDto)
		.mutation(async ({ input }) => createProductUseCase.execute(input)),

	update: protectedProcedure
		.input(
			z.object({
				productId: z.number(),
				data: updateProductDto,
			}),
		)
		.mutation(async ({ input }) =>
			updatePorductUseCase.execute(input.productId, input.data),
		),

	delete: protectedProcedure
		.input(
			z.object({
				productId: z.number(),
			}),
		)
		.mutation(({ input }) => deleteProductUseCase.execute(input.productId)),

	findOneBy: protectedProcedure
		.input(findOneProductByDto)
		.query(({ input }) => findOneProductByUseCase.execute(input)),
});
