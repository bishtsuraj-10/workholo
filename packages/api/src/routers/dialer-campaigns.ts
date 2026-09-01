import { db } from "@workholo/db";
import { dialerCampaign } from "@workholo/db/schema/dialer-campaign";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const dialerCampaignIdSchema = z.object({
	id: z.string().min(1),
});

export const createDialerCampaignSchema = z.object({
	accountTimezone: z.string().default("Asia/Kolkata"),
	addTransferList: z.string().default("Select an option"),
	afterCallDisposition: z.string().default("Select an option"),
	afterCallWorkDuration: z.number().int().min(0).default(0),
	agent: z.string().default(""),
	agentConnectionMethod: z.string().default("Dial In (Session)"),
	agentDialInNumber: z.string().default(""),
	agentOnlyCallback: z.boolean().default(false),
	agentVoiceGreeting: z.string().default("Select an option"),
	callerIdType: z.string().default("Select an option"),
	callsBeforeRingDuration: z.number().int().min(0).default(30),
	campaignCallerId: z.string().default(""),
	campaignScript: z.string().default("Select an option"),
	description: z.string().default(""),
	dialMethod: z.string().default("Preview"),
	dialStatus: z.string().default("New"),
	dispositionList: z.string().default("CRLAB"),
	enableInbound: z.boolean().default(false),
	enableManualDial: z.boolean().default(false),
	enforceAgentPauseCode: z.boolean().default(false),
	holidayCalendar: z.string().default("Select an option"),
	leadListId: z.string().min(1).nullable().optional(),
	manualDialLimit: z.number().int().min(0).default(0),
	name: z.string().min(1),
	previewDuration: z.number().int().min(0).default(10),
	refreshCount: z.number().int().min(0).default(1),
	refreshInterval: z.string().default("00:00:30"),
	ringTimeout: z.number().int().min(0).default(30),
	timeGroup: z.string().default("Select Time Group"),
	webform: z.string().default("Select Webform"),
	wrapUpTime: z.number().int().min(0).default(30),
});

export const updateDialerCampaignSchema = z.object({
	accountTimezone: z.string().optional(),
	addTransferList: z.string().optional(),
	afterCallDisposition: z.string().optional(),
	afterCallWorkDuration: z.number().int().min(0).optional(),
	agent: z.string().optional(),
	agentConnectionMethod: z.string().optional(),
	agentDialInNumber: z.string().optional(),
	agentOnlyCallback: z.boolean().optional(),
	agentVoiceGreeting: z.string().optional(),
	callerIdType: z.string().optional(),
	callsBeforeRingDuration: z.number().int().min(0).optional(),
	campaignCallerId: z.string().optional(),
	campaignScript: z.string().optional(),
	description: z.string().optional(),
	dialMethod: z.string().optional(),
	dialStatus: z.string().optional(),
	dispositionList: z.string().optional(),
	enableInbound: z.boolean().optional(),
	enableManualDial: z.boolean().optional(),
	enforceAgentPauseCode: z.boolean().optional(),
	holidayCalendar: z.string().optional(),
	id: z.string().min(1),
	leadListId: z.string().min(1).nullable().optional(),
	manualDialLimit: z.number().int().min(0).optional(),
	name: z.string().min(1).optional(),
	previewDuration: z.number().int().min(0).optional(),
	refreshCount: z.number().int().min(0).optional(),
	refreshInterval: z.string().optional(),
	ringTimeout: z.number().int().min(0).optional(),
	timeGroup: z.string().optional(),
	webform: z.string().optional(),
	wrapUpTime: z.number().int().min(0).optional(),
});

export const dialerCampaignsRouter = {
	create: protectedProcedure
		.input(createDialerCampaignSchema)
		.handler(async ({ input }) => {
			const [createdCampaign] = await db
				.insert(dialerCampaign)
				.values({
					...input,
					id: crypto.randomUUID(),
				})
				.returning();

			return createdCampaign;
		}),
	delete: protectedProcedure
		.input(dialerCampaignIdSchema)
		.handler(async ({ input }) => {
			const [deletedCampaign] = await db
				.delete(dialerCampaign)
				.where(eq(dialerCampaign.id, input.id))
				.returning();

			return deletedCampaign;
		}),
	getAll: protectedProcedure.handler(
		async () =>
			await db.select().from(dialerCampaign).orderBy(dialerCampaign.createdAt)
	),
	getById: protectedProcedure
		.input(dialerCampaignIdSchema)
		.handler(async ({ input }) => {
			const [foundCampaign] = await db
				.select()
				.from(dialerCampaign)
				.where(eq(dialerCampaign.id, input.id));

			return foundCampaign ?? null;
		}),
	update: protectedProcedure
		.input(updateDialerCampaignSchema)
		.handler(async ({ input }) => {
			const { id, ...updates } = input;
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([, value]) => value !== undefined)
			);

			if (Object.keys(cleanUpdates).length === 0) {
				const [existingCampaign] = await db
					.select()
					.from(dialerCampaign)
					.where(eq(dialerCampaign.id, id));

				return existingCampaign ?? null;
			}

			const [updatedCampaign] = await db
				.update(dialerCampaign)
				.set(cleanUpdates)
				.where(eq(dialerCampaign.id, id))
				.returning();

			return updatedCampaign ?? null;
		}),
};
