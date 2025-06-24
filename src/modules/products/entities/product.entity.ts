import type { products } from "@/integrations/db/tables";

export type Product = typeof products.$inferSelect & {
  category: {
    id: number;
    name: string;
  } | null;
};
