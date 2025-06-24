import type { CreateCategoryDto } from "../dtos/category.dts";
import type { CategoriesCommandRepository } from "../repositories/categories-command.repository";

export class CreateCategoryUseCase {
	constructor(
		private readonly categoriesCommandRepository: CategoriesCommandRepository,
	) {}

	public async execute(data: CreateCategoryDto) {
		return this.categoriesCommandRepository.create(data);
	}
}
