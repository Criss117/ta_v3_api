import { relations } from "drizzle-orm";
import {
	categories,
	clients,
	installmentPayments,
	installmentPlans,
	payments,
	products,
	ticketItems,
	tickets,
} from "./tables";

export const categoryRelations = relations(categories, ({ many }) => ({
	products: many(products, {
		relationName: "products_category_id",
	}),
}));

export const productRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
		relationName: "products_category_id",
	}),
	ticketItems: many(ticketItems, {
		relationName: "ticket_items_product_id",
	}),
}));

export const clientRelations = relations(clients, ({ many }) => ({
	tickets: many(tickets, {
		relationName: "tickets_client_id",
	}),
	installmentPlans: many(installmentPlans, {
		relationName: "installment_plans_client_id",
	}),
	payments: many(payments, {
		relationName: "payments_client_id",
	}),
}));

export const ticketRelations = relations(tickets, ({ one, many }) => ({
	client: one(clients, {
		fields: [tickets.clientId],
		references: [clients.id],
		relationName: "tickets_client_id",
	}),
	installmentPlan: many(installmentPlans, {
		relationName: "installments_ticket_id",
	}),
	ticketItems: many(ticketItems, {
		relationName: "ticket_items_ticket_id",
	}),
	payments: many(payments, {
		relationName: "payments_ticket_id",
	}),
}));

export const ticketItemRelations = relations(ticketItems, ({ one }) => ({
	ticket: one(tickets, {
		fields: [ticketItems.ticketId],
		references: [tickets.id],
		relationName: "ticket_items_ticket_id",
	}),
	product: one(products, {
		fields: [ticketItems.ticketId],
		references: [products.id],
		relationName: "ticket_items_product_id",
	}),
}));

export const installmentPlanRelations = relations(
	installmentPlans,
	({ one, many }) => ({
		client: one(clients, {
			fields: [installmentPlans.clientId],
			references: [clients.id],
			relationName: "installment_plans_client_id",
		}),
		installmentPayments: many(installmentPayments, {
			relationName: "intallment_payments_installment_plan_id",
		}),
	}),
);

export const installmentPaymentRelations = relations(
	installmentPayments,
	({ one }) => ({
		installmentPlan: one(installmentPlans, {
			fields: [installmentPayments.planId],
			references: [installmentPlans.id],
			relationName: "intallment_payments_installment_plan_id",
		}),
	}),
);

export const paymentRelations = relations(payments, ({ one }) => ({
	client: one(clients, {
		fields: [payments.clientId],
		references: [clients.id],
		relationName: "payments_client_id",
	}),
}));
