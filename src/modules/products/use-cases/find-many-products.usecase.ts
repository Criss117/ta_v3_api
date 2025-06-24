import { calculateNextCursor } from "@/modules/shared/utils/next-cursor";
import type { FindManyProductsDto } from "../dtos/find-many-products.dto";
import type { Product } from "../entities/product.entity";
import type { ProductsQueryRepository } from "../repositories/products-query.repository";
import type {
  BaseCursorDto,
  Paginated,
} from "@/modules/shared/dtos/cursor.dto";

export class FindManyProductsUseCase {
  constructor(
    private readonly productQueryRepository: ProductsQueryRepository,
  ) {}

  public async execute(
    meta: FindManyProductsDto,
  ): Promise<Paginated<Product, BaseCursorDto>> {
    const data = await this.productQueryRepository.findMany(meta);

    const { hasMore, items, lastItem } = calculateNextCursor(data, meta.limit);

    const nextCursor: BaseCursorDto = {
      lastId: hasMore ? lastItem.id : null,
      createdAt: hasMore ? lastItem.createdAt : null,
    };

    return {
      items,
      nextCursor,
    };
  }
}
