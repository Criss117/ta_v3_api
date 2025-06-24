import type { CreateProductDto } from "../dtos/create-product.dto";
import type { ProductsCommandRepository } from "../repositories/products-command.repository";

export class CreateProductUseCase {
  constructor(
    private readonly productsCommandRepository: ProductsCommandRepository,
  ) {}

  public execute(data: CreateProductDto) {
    return this.productsCommandRepository.create(data);
  }
}
