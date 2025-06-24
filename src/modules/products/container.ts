import { dbClient } from "@/integrations/db";
import { CategoriesCommandRepository } from "./repositories/categories-command.repository";
import { CategoriesQueryRepository } from "./repositories/categories-query.repository";
import { ProductsCommandRepository } from "./repositories/products-command.repository";
import { ProductsQueryRepository } from "./repositories/products-query.repository";
import { CreateCategoryUseCase } from "./use-cases/create-category.usecase";
import { CreateProductUseCase } from "./use-cases/create-product.usecase";
import { DeleteProductUseCase } from "./use-cases/delete-product.usecase";
import { FindManyCategoriesUseCase } from "./use-cases/find-many-categories.usecase";
import { FindManyProductsUseCase } from "./use-cases/find-many-products.usecase";
import { UpdateProductUseCase } from "./use-cases/update-product.usecase";
import { UpdateProductStockUseCase } from "./use-cases/update-product-stock.usecase";
import { FindOneProductByUseCase } from "./use-cases/find-one-product-by.usecase";

//Repositories
export const categoriesCommandRepository = new CategoriesCommandRepository(
	dbClient.client,
);
export const categoriesQueryRepository = new CategoriesQueryRepository(
	dbClient.client,
);

export const productsCommandRepository = new ProductsCommandRepository(
	dbClient.client,
);
export const productsQueryRepository = new ProductsQueryRepository(
	dbClient.client,
);

//UseCases
export const createCategoryUseCase = new CreateCategoryUseCase(
	categoriesCommandRepository,
);

export const createProductUseCase = new CreateProductUseCase(
	productsCommandRepository,
);

export const deleteProductUseCase = new DeleteProductUseCase(
	productsCommandRepository,
);

export const findManyCategoriesUseCase = new FindManyCategoriesUseCase(
	categoriesQueryRepository,
);

export const findManyProductsUseCase = new FindManyProductsUseCase(
	productsQueryRepository,
);

export const findOneProductByUseCase = new FindOneProductByUseCase(
	productsQueryRepository,
);

export const updatePorductUseCase = new UpdateProductUseCase(
	productsQueryRepository,
	productsCommandRepository,
	categoriesQueryRepository,
);

export const updateProductStockUseCase = new UpdateProductStockUseCase(
	productsCommandRepository,
);
