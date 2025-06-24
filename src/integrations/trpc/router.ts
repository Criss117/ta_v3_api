import { createTRPCRouter, publicProcedure } from ".";
import { productsProcedure } from "@/modules/products/controllers/products.controller";
import { categoriesProcedure } from "@/modules/products/controllers/categories.controller";
import { clientsController } from "@/modules/clients/controllers/clients.controller";
import { ticketsController } from "@/modules/tickets/controllers/tickets.controller";

export const appRouter = createTRPCRouter({
	products: productsProcedure,
	categories: categoriesProcedure,
	clients: clientsController,
	tickets: ticketsController,
	greets: publicProcedure.query(() => "hello world"),
});

export type AppRouter = typeof appRouter;
