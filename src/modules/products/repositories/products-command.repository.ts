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
import { products } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { UpdateProductDto } from "../dtos/update-product.dto";
import type { CreateProductDto } from "../dtos/create-product.dto";
import type { TX } from "@/modules/shared/models/types";
import type { UpdateStockDto } from "../dtos/update-stock.dto";

export class ProductsCommandRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async create(newProduct: CreateProductDto) {
    await this.db.insert(products).values({
      ...newProduct,
    });
  }

  public async update(productId: number, data: UpdateProductDto) {
    //TODO: change categoryId and select product with category
    await this.db.update(products).set(data).where(eq(products.id, productId));
  }

  public async delete(productId: number) {
    await this.db
      .update(products)
      .set({
        barcode: null,
        deletedAt: new Date(),
        isActive: false,
      })
      .where(eq(products.id, productId));
  }

  public async updateStock(data: UpdateStockDto, tx?: TX) {
    const db = tx ? tx : this.db;

    return db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${data.quantity}`,
      })
      .where(eq(products.id, data.productId));
  }
}
