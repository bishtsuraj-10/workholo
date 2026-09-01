import { db } from "@workholo/db";
import { lead } from "@workholo/db/schema/lead";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

const leadIdSchema = z.object({
	id: z.string().min(1),
});

const leadListIdSchema = z.object({
	leadListId: z.string().min(1),
});

const customDataSchema = z.record(z.string(), z.unknown());

const leadFields = {
	address: z.string().default(""),
	alternatePhoneNumber: z.string().default(""),
	callCount: z.number().int().min(0).default(0),
	companyName: z.string().default(""),
	customData: customDataSchema.default({}),
	dispositionList: z.string().default(""),
	email: z.string().default(""),
	leadListId: z.string().min(1),
	leadStatus: z.string().default("New"),
	name: z.string().default(""),
	phoneNumber: z.string().default(""),
};

export const createLeadSchema = z.object(leadFields);

export const updateLeadSchema = z.object({
	address: leadFields.address.optional(),
	alternatePhoneNumber: leadFields.alternatePhoneNumber.optional(),
	callCount: leadFields.callCount.optional(),
	companyName: leadFields.companyName.optional(),
	customData: leadFields.customData.optional(),
	dispositionList: leadFields.dispositionList.optional(),
	email: leadFields.email.optional(),
	id: z.string().min(1),
	leadListId: leadFields.leadListId.optional(),
	leadStatus: leadFields.leadStatus.optional(),
	name: leadFields.name.optional(),
	phoneNumber: leadFields.phoneNumber.optional(),
});

export const leadsRouter = {
	create: protectedProcedure
		.input(createLeadSchema)
		.handler(async ({ input }) => {
			const [createdLead] = await db
				.insert(lead)
				.values({ ...input, id: crypto.randomUUID() })
				.returning();

			return createdLead;
		}),
	delete: protectedProcedure.input(leadIdSchema).handler(async ({ input }) => {
		const [deletedLead] = await db
			.delete(lead)
			.where(eq(lead.id, input.id))
			.returning();

		return deletedLead ?? null;
	}),
	getById: protectedProcedure.input(leadIdSchema).handler(async ({ input }) => {
		const [foundLead] = await db
			.select()
			.from(lead)
			.where(eq(lead.id, input.id));

		return foundLead ?? null;
	}),
	getByLeadListId: protectedProcedure
		.input(leadListIdSchema)
		.handler(
			async ({ input }) =>
				await db
					.select()
					.from(lead)
					.where(eq(lead.leadListId, input.leadListId))
					.orderBy(asc(lead.createdAt))
		),
	update: protectedProcedure
		.input(updateLeadSchema)
		.handler(async ({ input }) => {
			const { id, ...updates } = input;
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([, value]) => value !== undefined)
			);

			if (Object.keys(cleanUpdates).length === 0) {
				const [existingLead] = await db
					.select()
					.from(lead)
					.where(eq(lead.id, id));

				return existingLead ?? null;
			}

			const [updatedLead] = await db
				.update(lead)
				.set(cleanUpdates)
				.where(eq(lead.id, id))
				.returning();

			return updatedLead ?? null;
		}),
};
