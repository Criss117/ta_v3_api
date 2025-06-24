import {
  and,
  desc,
  eq,
  getTableColumns,
  isNotNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { categories, products } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { FindOneProductByDto } from "../dtos/find.dto";
import type { FindManyProductsDto } from "../dtos/find-many-products.dto";
import type { Product } from "../entities/product.entity";

export class ProductsQueryRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async findMany({
    cursor,
    limit,
    searchQuery,
  }: FindManyProductsDto): Promise<Product[]> {
    return this.db
      .select({
        ...getTableColumns(products),
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(
        and(
          or(
            cursor.createdAt
              ? lte(products.createdAt, cursor.createdAt)
              : sql`true`,
            and(
              cursor.createdAt
                ? eq(products.createdAt, cursor.createdAt)
                : sql`true`,
              cursor.lastId ? lte(products.id, cursor.lastId) : sql`true`,
            ),
          ),
          or(
            searchQuery
              ? like(products.description, `%${searchQuery}%`)
              : sql`true`,
            searchQuery
              ? like(products.barcode, `%${searchQuery}%`)
              : sql`true`,
          ),
          eq(products.isActive, true),
          isNotNull(products.barcode),
        ),
      )
      .orderBy(desc(products.createdAt))
      .limit(limit + 1);
  }

  public async findOneBy({ barcode, productId }: FindOneProductByDto) {
    if (!barcode && !productId) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
      });
    }

    const [product] = await this.db
      .select({
        ...getTableColumns(products),
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(
        and(
          barcode ? eq(products.barcode, barcode) : sql`true`,
          productId ? eq(products.id, productId) : sql`true`,
          eq(products.isActive, true),
          isNotNull(products.barcode),
        ),
      );

    if (!product) {
      return null;
    }

    return product;
  }
}
