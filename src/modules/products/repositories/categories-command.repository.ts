import { categories } from "@/integrations/db/tables";
import type { DBClient } from "@/integrations/db";
import type { CreateCategoryDto } from "../dtos/category.dts";

export class CategoriesCommandRepository {
  constructor(private readonly db: DBClient["client"]) {}

  public async create(data: CreateCategoryDto) {
    return this.db.insert(categories).values(data);
  }
}
