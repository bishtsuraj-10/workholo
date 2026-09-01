import { env } from "@workholo/env/server";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";

import {
	account,
	accountRelations,
	agentGroup,
	blockedNumber,
	department,
	dialerCampaign,
	inboundQueue,
	lead,
	leadList,
	leadListField,
	platformUser,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
} from "./schema";

const schema = {
	account,
	accountRelations,
	agentGroup,
	blockedNumber,
	department,
	dialerCampaign,
	inboundQueue,
	lead,
	leadList,
	leadListField,
	platformUser,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
};

export function createDb(): NodePgDatabase<typeof schema> {
	return drizzle(env.DATABASE_URL, { schema });
}

export const db: NodePgDatabase<typeof schema> = createDb();
