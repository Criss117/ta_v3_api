import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";
import {
  auditMetadata,
  installmentModality,
  payType,
  ticketStatus,
} from "./shared";
import { v7 as uuidv7 } from "uuid";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description", {
    length: 255,
  }),
  ...auditMetadata,
});

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    barcode: text("barcode", {
      length: 255,
    }).unique(),
    description: text("description", {
      length: 255,
    }).notNull(),
    costPrice: integer("cost_price").notNull(),
    salePrice: integer("sale_price").notNull(),
    wholesalePrice: integer("wholesale_price").notNull(),
    stock: integer("stock").notNull(),
    minStock: integer("min_stock").notNull(),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
    ...auditMetadata,
  },
  (table) => [index("barcode_idx").on(table.barcode)],
);

export const clients = sqliteTable(
  "clients",
  {
    id: text("id")
      .$defaultFn(() => uuidv7())
      .unique()
      .notNull(),
    fullName: text("full_name", {
      length: 255,
    }).notNull(),
    email: text("email", {
      length: 255,
    }).unique(),
    phone: text("phone", {
      length: 20,
    }).unique(),
    address: text("address", {
      length: 255,
    }),
    creditLimit: integer("credit_limit").notNull(),
    clientCode: text("client_code", {
      length: 100,
    }).notNull(),
    globalNumberOfInstallments: integer("global_number_of_installments")
      .default(1)
      .notNull(),
    globalInstallmentModality: text("global_installment_modality", {
      enum: installmentModality,
    })
      .notNull()
      .default("monthly"),
    ...auditMetadata,
  },
  (t) => [
    index("full_name_idx").on(t.fullName),
    index("client_code_idx").on(t.clientCode),
  ],
);

export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  clientId: text("client_id").references(() => clients.id),
  total: integer("total").notNull(),
  totalPaid: integer("total_paid").notNull().default(0),
  status: text("status", {
    enum: ticketStatus,
  }).notNull(),
  payType: text("pay_type", {
    enum: payType,
  }),
  ...auditMetadata,
});

export const ticketItems = sqliteTable("ticket_items", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  productId: integer("product_id")
    .references(() => products.id, {
      onDelete: "set null",
    })
    .notNull(),
  ticketId: integer("ticket_id")
    .references(() => tickets.id, {
      onDelete: "cascade",
    })
    .notNull(),
  description: text("description", {
    length: 255,
  }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
  ...auditMetadata,
});

export const installmentPlans = sqliteTable("installments_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  clientId: text("client_id")
    .references(() => clients.id)
    .notNull(),
  numberOfInstallments: integer("number_of_installment").notNull(),
  installmentsPaid: integer("installments_paid").notNull().default(0),
  modality: text("modality", {
    enum: installmentModality,
  }).notNull(),
  totalPaid: integer("total_paid").notNull().default(0),
  total: integer("total").notNull(),
  status: text("status", {
    enum: ticketStatus,
  })
    .default("unpaid")
    .notNull(),
  ...auditMetadata,
});

export const installmentPayments = sqliteTable("installmets_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  planId: integer("plan_id")
    .references(() => installmentPlans.id, {
      onDelete: "cascade",
    })
    .notNull(),
  installmentNumber: integer("installment_number").notNull(),
  dueDate: integer("due_date", {
    mode: "timestamp",
  }).notNull(),
  paymentDate: integer("payment_date", {
    mode: "timestamp",
  }),
  subtotalPaid: integer("subtotal_paid").notNull().default(0),
  subtotal: integer("subtotal").notNull(),
  status: text("status", {
    enum: ticketStatus,
  })
    .default("unpaid")
    .notNull(),
  ...auditMetadata,
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  clientId: text("client_id")
    .references(() => clients.id)
    .notNull(),
  amount: integer("amount").notNull(),
  note: text("note", {
    length: 225,
  }),
  ...auditMetadata,
});
