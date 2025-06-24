import { TRPCError } from "@trpc/server";
import type { UpdateProductDto } from "../dtos/update-product.dto";
import type { ProductsCommandRepository } from "../repositories/products-command.repository";
import type { ProductsQueryRepository } from "../repositories/products-query.repository";
import type { CategoriesQueryRepository } from "../repositories/categories-query.repository";

export class UpdateProductUseCase {
  constructor(
    private readonly productsQueryRepository: ProductsQueryRepository,
    private readonly productsCommandRepository: ProductsCommandRepository,
    private readonly categoriesQueryRepository: CategoriesQueryRepository,
  ) {}

  public async execute(productId: number, data: UpdateProductDto) {
    const currentProduct = await this.productsQueryRepository.findOneBy({
      productId,
    });

    if (!currentProduct) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "El producto no existe",
      });
    }

    if (data.barcode !== currentProduct.barcode) {
      const existsBarcode = await this.productsQueryRepository.findOneBy({
        barcode: data.barcode,
      });

      if (existsBarcode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El código de barras ya esta siendo utilizado",
        });
      }
    }

    if (data.categoryId && data.categoryId !== currentProduct.categoryId) {
      const existingCategory = await this.categoriesQueryRepository.findOneBy({
        categoryId: data.categoryId,
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "La categoría no existe",
        });
      }
    }

    return this.productsCommandRepository.update(productId, data);
  }
}
