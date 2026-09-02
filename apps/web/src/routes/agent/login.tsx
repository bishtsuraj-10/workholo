// biome-ignore-all lint/performance/noJsxPropsBind: The action uses the route-local navigator.

import { createFileRoute } from "@tanstack/react-router";
import { AgentLogin } from "@/components/agent/agent-login";

export const Route = createFileRoute("/agent/login")({
	component: AgentLogin,
});
