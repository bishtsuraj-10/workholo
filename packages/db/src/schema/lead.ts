import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { leadList } from "./lead-list";

export const lead = pgTable(
	"lead",
	{
		address: text("address").default("").notNull(),
		alternatePhoneNumber: text("alternate_phone_number").default("").notNull(),
		callCount: integer("call_count").default(0).notNull(),
		companyName: text("company_name").default("").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		customData: jsonb("custom_data")
			.$type<Record<string, unknown>>()
			.default({})
			.notNull(),
		dispositionList: text("disposition_list").default("").notNull(),
		email: text("email").default("").notNull(),
		id: text("id").primaryKey(),
		leadListId: text("lead_list_id")
			.notNull()
			.references(() => leadList.id, { onDelete: "cascade" }),
		leadStatus: text("lead_status").default("New").notNull(),
		name: text("name").default("").notNull(),
		phoneNumber: text("phone_number").default("").notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("lead_lead_list_id_idx").on(table.leadListId)]
);
