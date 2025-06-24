import { createTRPCRouter, protectedProcedure } from "@/integrations/trpc";
import { createCategoryDto } from "../dtos/category.dts";
import { findManyCategoriesDto } from "../dtos/find-many-categories.dto";
import { createCategoryUseCase, findManyCategoriesUseCase } from "../container";

export const categoriesProcedure = createTRPCRouter({
	findMany: protectedProcedure
		.input(findManyCategoriesDto)
		.query(({ input }) => findManyCategoriesUseCase.execute(input)),

	create: protectedProcedure
		.input(createCategoryDto)
		.mutation(({ input }) => createCategoryUseCase.execute(input)),
});
