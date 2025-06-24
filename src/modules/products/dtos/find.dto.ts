import { z } from "zod";

export const findOneProductByDto = z.object({
  barcode: z.string().nullish(),
  productId: z.number().nullish(),
});

export const findOneCategoryBy = z.object({
  categoryId: z.number().positive().nullish(),
  name: z.string().nullish(),
});

export type FindOneProductByDto = z.infer<typeof findOneProductByDto>;
export type FindOneCategoryByDto = z.infer<typeof findOneCategoryBy>;
