import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const auditMetadata = {
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
};

export const ticketStatus = ["unpaid", "partial", "paid"] as const;
export const ticketCreditType = ["global", "individual"] as const;
export const installmentModality = ["weekly", "monthly", "biweekly"] as const;
export const payType = ["cash", "credit"] as const;

export type InstallmentModality = (typeof installmentModality)[number];
export type CreditType = (typeof ticketCreditType)[number];
export type TicketStaus = (typeof ticketStatus)[number];
