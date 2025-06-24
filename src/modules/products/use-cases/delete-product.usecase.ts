import type { ProductsCommandRepository } from "../repositories/products-command.repository";

export class DeleteProductUseCase {
  constructor(
    private readonly productsCommandRepository: ProductsCommandRepository,
  ) {}

  public async execute(productId: number) {
    return this.productsCommandRepository.delete(productId);
  }
}
