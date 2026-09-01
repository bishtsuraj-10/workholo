import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { leadList } from "./lead-list";

export const dialerCampaign = pgTable("dialer_campaign", {
	accountTimezone: text("account_timezone").default("Asia/Kolkata").notNull(),
	addTransferList: text("add_transfer_list")
		.default("Select an option")
		.notNull(),
	afterCallDisposition: text("after_call_disposition")
		.default("Select an option")
		.notNull(),
	afterCallWorkDuration: integer("after_call_work_duration")
		.default(0)
		.notNull(),
	agent: text("agent").default("").notNull(),
	agentConnectionMethod: text("agent_connection_method")
		.default("Dial In (Session)")
		.notNull(),
	agentDialInNumber: text("agent_dial_in_number").default("").notNull(),
	agentOnlyCallback: boolean("agent_only_callback").default(false).notNull(),
	agentVoiceGreeting: text("agent_voice_greeting")
		.default("Select an option")
		.notNull(),
	callerIdType: text("caller_id_type").default("Select an option").notNull(),
	callsBeforeRingDuration: integer("calls_before_ring_duration")
		.default(30)
		.notNull(),
	campaignCallerId: text("campaign_caller_id").default("").notNull(),
	campaignScript: text("campaign_script").default("Select an option").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	description: text("description").default("").notNull(),
	dialMethod: text("dial_method").default("Preview").notNull(),
	dialStatus: text("dial_status").default("New").notNull(),
	dispositionList: text("disposition_list").default("CRLAB").notNull(),
	enableInbound: boolean("enable_inbound").default(false).notNull(),
	enableManualDial: boolean("enable_manual_dial").default(false).notNull(),
	enforceAgentPauseCode: boolean("enforce_agent_pause_code")
		.default(false)
		.notNull(),
	holidayCalendar: text("holiday_calendar")
		.default("Select an option")
		.notNull(),
	id: text("id").primaryKey(),
	leadListId: text("lead_list_id").references(() => leadList.id, {
		onDelete: "set null",
	}),
	manualDialLimit: integer("manual_dial_limit").default(0).notNull(),
	name: text("name").notNull(),
	previewDuration: integer("preview_duration").default(10).notNull(),
	refreshCount: integer("refresh_count").default(1).notNull(),
	refreshInterval: text("refresh_interval").default("00:00:30").notNull(),
	ringTimeout: integer("ring_timeout").default(30).notNull(),
	timeGroup: text("time_group").default("Select Time Group").notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	webform: text("webform").default("Select Webform").notNull(),
	wrapUpTime: integer("wrap_up_time").default(30).notNull(),
});
