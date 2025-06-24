import { calculateNextCursor } from "@/modules/shared/utils/next-cursor";
import type { BaseCursorDto } from "@/modules/shared/dtos/cursor.dto";
import type { FindManyCategoriesDto } from "../dtos/find-many-categories.dto";
import type { CategoriesQueryRepository } from "../repositories/categories-query.repository";

export class FindManyCategoriesUseCase {
  constructor(
    private readonly categoriesQueryRepository: CategoriesQueryRepository,
  ) {}

  public async execute(meta: FindManyCategoriesDto) {
    const data = await this.categoriesQueryRepository.findMany(meta);

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
