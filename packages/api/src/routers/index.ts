import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { agentGroupsRouter } from "./agent-groups";
import { blockedNumbersRouter } from "./blocked-numbers";
import { departmentsRouter } from "./departments";
import { dialerCampaignsRouter } from "./dialer-campaigns";
import { inboundQueuesRouter } from "./inbound-queues";
import { leadListsRouter } from "./lead-lists";
import { leadsRouter } from "./leads";
import { platformUsersRouter } from "./platform-users";
import { usersRouter } from "./users";

export const appRouter = {
	agentGroups: agentGroupsRouter,
	blockedNumbers: blockedNumbersRouter,
	departments: departmentsRouter,
	dialerCampaigns: dialerCampaignsRouter,
	healthCheck: publicProcedure.handler(() => "OK"),
	inboundQueues: inboundQueuesRouter,
	leadLists: leadListsRouter,
	leads: leadsRouter,
	platformUsers: platformUsersRouter,
	privateData: protectedProcedure.handler(({ context }) => ({
		message: "This is private",
		user: context.session?.user,
	})),
	users: usersRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
