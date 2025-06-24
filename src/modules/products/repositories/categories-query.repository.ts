import { and, desc, eq, like, lte, or, sql } from "drizzle-orm";
import { categories } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { Category } from "../entities/category.entity";
import type { FindManyCategoriesDto } from "../dtos/find-many-categories.dto";
import { FindOneCategoryByDto } from "../dtos/find.dto";
import { TRPCError } from "@trpc/server";

export class CategoriesQueryRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public findMany({
    cursor,
    limit,
    searchQuery,
  }: FindManyCategoriesDto): Promise<Category[]> {
    return this.db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .where(
        and(
          or(
            cursor.createdAt
              ? lte(categories.createdAt, cursor.createdAt)
              : sql`true`,
            and(
              cursor.createdAt
                ? eq(categories.createdAt, cursor.createdAt)
                : sql`true`,
              cursor.lastId ? lte(categories.id, cursor.lastId) : sql`true`,
            ),
          ),
          or(
            searchQuery ? like(categories.name, `%${searchQuery}%`) : sql`true`,
          ),
          eq(categories.isActive, true),
        ),
      )
      .orderBy(desc(categories.createdAt))
      .limit(limit + 1);
  }

  public async findOneBy({ categoryId, name }: FindOneCategoryByDto) {
    if (!categoryId && !name) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
      });
    }

    const [category] = await this.db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
      })
      .from(categories)
      .where(
        or(
          categoryId ? eq(categories.id, categoryId) : sql`true`,
          name ? like(categories.name, `%${name}%`) : sql`true`,
        ),
      );

    if (!category) {
      return null;
    }

    return category;
  }
}
